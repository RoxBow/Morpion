class ListRooms {
    constructor() {
        this.list = [];
    }

    addRoom(room) {
        this.list.push(room);
    }

    createRoom(idRoom) {
        const newRoom = {
            id: idRoom,
            state: 'wait',
            users: [],
            messages: []
        }

        this.addRoom(newRoom);
        return newRoom;
    }

    findAvailableRoom() {
        const room = this.list.find(room =>
            room.users.length < 3
        );

        return room;
    }

    findRoomById(id) {
        const roomFound = this.list.find(room =>
            room.id === id
        );

        return roomFound;
    }

    updateMsg(msg, roomUser) {
        this.list.map(room => {

            if (room.id === roomUser) {
                room.messages.push(msg);
            }
        });
    }

    addPlayerInRoom(user, roomUser) {

        this.list.map(room => {
            if (room.id === roomUser) {
                room.users.push(user);

                if (room.users.length === 2)
                    room.state = 'full';
            }
        });
    }

    removePlayerInRoom(user, roomUser) {
        let currentRoom = false;

        this.list.map(room => {

            if (room.id === roomUser) {
                const indexUser = room.users.indexOf(user);
                room.users.splice(indexUser, 1);

                if (room.users.length > 0) {
                    room.state = 'wait';
                    currentRoom = room;
                } else {
                    const indexRoom = this.list.indexOf(room);
                    this.list.splice(indexRoom, 1);
                }
            }
        });

        return currentRoom;
    }

    createMorpion(morpion, roomUser)  {
        this.list.map(room => {
            if (room.id === roomUser) {
                room.game = morpion;
            }
        });
    }

    endGame(roomUser)  {
        this.list.map(room => {
            if (room.id === roomUser) {
                room.state = 'end';
            }
        });
    }

}

module.exports = ListRooms;