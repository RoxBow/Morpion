const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mysql = require('mysql');

const config = require('./config');

const {
    cryptPassword,
    comparePassword
} = require('./encryptPassword');

// Connect to database
const BDD = mysql.createConnection({
    socketPath: config.database.socketPath,
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.table,
    port: config.database.port
});

/* Class imports */
const Game = require('./class/Game.js');
const ListUsers = require('./class/ListUsers.js');
const ListRooms = require('./class/ListRooms.js');

/* Data */
const data = require('./data.json');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

let listUser, listRoom, listMsg;

io.on('connection', socket => {

    // When user click on case tictactoe
    socket.on('add piece', (posX, posY) => {
        addPiece(socket, posX, posY);
    });

    socket.on('save user', (username, password, kindAccount) => {
        if (kindAccount === 'invite' && isValidUsername(socket, username)) {
            createInvite(socket, username);
        } else if (kindAccount === 'account' && isValidUsername(socket, username)) {
            createOrLogAccount(socket, username, password);
        }
    });

    socket.on('send msg', (msg, username) => {
        sendMsg(socket, msg, username);
    });

    socket.on('join game', () => {
        joinGame(socket);
    });

    socket.on('leave game', room => {
        leaveGame(socket, room);
    });

    socket.on('get user', id => {
        findUserBddWithId(id, socket);
    });

    socket.on('log out', () => {
        logOut(socket);
    });

    socket.on('disconnect', () => {
        logOut(socket);
    });

});

http.listen(process.env.PORT || 3000, () => {
    console.log('listening on *:3000');

    // init all list for HOME
    listUser = new ListUsers();
    listRoom = new ListRooms();

    // set some fake messages
    listMsg = data.messages;
    // listMsg = [];
});

const isValidUsername = (socket, username) => {
    const alreadyExist = listUser.userIsFound(username);
    let errorMessage;

    if (alreadyExist) {
        errorMessage = `${username} is already used`;
    } else if (username.length < 3) {
        errorMessage = `${username} is too short`;
    } else if (username.length > 12) {
        errorMessage = `${username} is too big`;
    } else {
        return true;
    }

    socket.emit('error username', errorMessage);

    return false;
}

const createInvite = (socket, username) => {
    const idUser = randomId();

    // model user
    const user = {
        idUser: idUser,
        username: username,
        win: 0,
        games: 0
    }

    initNewUserOnConnect(socket, user, true)
}

const createAccount = (username, password) => {
    const idUser = randomId();

    // create new user
    const user = {
        idUser: idUser,
        username: username,
        win: 0,
        games: 0
    }

    const newPassword = cryptPassword(password);

    const query = `INSERT INTO user (idUser, username, password, win, game) 
                    VALUES ('${idUser}', '${username}', '${newPassword}', 0, 0)`

    BDD.query(query, error => {
        if (error) throw error;
        console.log("User saves in BDD");
    });

    return user;
}

const createOrLogAccount = (socket, username, password) => {

    const query = `SELECT idUser, username, password, win, game FROM user 
                    WHERE '${username}' = username`;

    BDD.query(query, (error, result) => {
        if (error) throw error;

        let user;

        if (result.length > 0) {
            const isRightPassword = cryptPassword(password, result[0].password);

            if (isRightPassword) {
                // remove RowDataPacket (mysql syntax)
                user = JSON.parse(JSON.stringify(result[0]));
                delete user.password;
            } else {
                socket.emit('error password', 'Wrong password');
                return;
            }
        } else if (result.length === 0) {
            // if user doesn't exist in BDD
            user = createAccount(username, password);
        }

        initNewUserOnConnect(socket, user);
    });
}

const findUserBddWithId = (idUser, socket) => {
    const query = `SELECT idUser, username, win, game FROM user 
                WHERE '${idUser}' = idUser`;

    BDD.query(query, (error, result) => {
        if (error) throw error;
        if (result.length > 0) {
            const user = JSON.parse(JSON.stringify(result[0]));
            initNewUserOnConnect(socket, user);
        } else {
            socket.emit('problem user');
        }
    });
}

const initNewUserOnConnect = (socket, user, isInvitedAccount) => {
    // add user in list users server
    listUser.addUser(user);

    // stock idUser in socket object
    socket.idUser = user.idUser;
    socket.emit('valid user', user.idUser, user, isInvitedAccount);

    // update all data users in Home room
    sendDataHome(socket, listUser, listMsg);
}

const sendDataHome = (socket, listUser, listMsg) =>  {
    io.sockets.emit('send list user', listUser.list);
    socket.emit('send list message', listMsg);
}

const joinGame = (socket, idRoomWanted) => {
    const currentUser = listUser.findUserById(socket.idUser);
    let room = listRoom.findAvailableRoom();
    const wantedRoomExist = listRoom.findRoomById(idRoomWanted);

    /**
     * If no place in room then create new room
     * and user doesn't want to join specific room
     */
    if (!room && !wantedRoomExist) {
        const idRoom = randomId();
        room = listRoom.createRoom(idRoom);
    } else if (wantedRoomExist) {
        room = wantedRoomExist;
    }

    listRoom.addPlayerInRoom(currentUser, room.id);
    socket.join(room.id);
    socket.idRoom = room.id;
    io.sockets.in(room.id).emit('update room', room);
    startGame(socket, room);
}

const startGame = (socket, room) =>  {
    if (room.state === 'full') {
        const morpion = new Game(3);

        morpion.player1 = room.users[Math.floor(Math.random() * room.users.length)];
        morpion.player2 = room.users.find((user) => user !== morpion.player1);

        listRoom.createMorpion(morpion, room.id);
        const currentPlayer = morpion.currentTurn === 1 ? morpion.player1.username : morpion.player2.username;
        io.sockets.in(room.id).emit('send board', morpion.board, currentPlayer);
    }
}

const leaveGame = (socket, room) => {
    const user = listUser.findUserById(socket.idUser);
    const updateRoom = listRoom.removePlayerInRoom(user, room.id)

    socket.leave(room.id);
    socket.idRoom = null;

    // update only if there are still 1 user in room
    if (updateRoom) {
        socket.broadcast.to(room.id).emit('update room', updateRoom);
    }
}

const sendMsg = (socket, msg, username) => {
    const currentRoom = socket.idRoom;

    // accept only letters and basic ponctuations
    const msgClean = msg.trim();

    const newMsg = {
        username: username,
        text: msgClean,
        date: new Date()
    }

    // if user is in room
    if (currentRoom) {
        listRoom.updateMsg(newMsg, currentRoom);
        const updateRoom = listRoom.findRoomById(currentRoom);
        io.sockets.in(currentRoom).emit('send list message', updateRoom.messages);
    } else {
        listMsg.push(newMsg);
        io.sockets.emit('send list message', listMsg);
    }
}

const addPiece = (socket, posX, posY) => {
    const idRoom = socket.idRoom;
    const currentRoom = listRoom.findRoomById(idRoom);

    currentRoom.game.addPiece(posX, posY);

    // When player wins
    if (currentRoom.game.player1.winner ||
        currentRoom.game.player2.winner) {
        listRoom.endGame(idRoom);

        listUser.updateCountGame(currentRoom.game.player1);
        listUser.updateCountGame(currentRoom.game.player2);

        if (currentRoom.game.player1.winner) currentRoom.game.winner = currentRoom.game.player1;
        else if (currentRoom.game.player2.winner) currentRoom.game.winner = currentRoom.game.player2;

        io.sockets.in(idRoom).emit('update room', currentRoom);
        return;
    }

    const currentPlayer = currentRoom.game.currentTurn === 1 ? currentRoom.game.player1.username : currentRoom.game.player2.username;
    io.sockets.in(idRoom).emit('send board', currentRoom.game.board, currentPlayer);
}

const logOut = (socket) => {
    const currentUser = listUser.findUserById(socket.idUser);
    listUser.removeUser(currentUser);
    socket.idUser = undefined;

    // send new list user
    socket.broadcast.emit('send list user', listUser.list);
}

// Generate unique ID
const randomId = () =>
    Math.random().toString(36).substr(2, 9);
    