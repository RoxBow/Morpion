
import React from 'react';
import io from 'socket.io-client'

// ### Components ###
import Board from './components/Board';
import Chat from './components/Chat';
import FormAuthentication from './components/FormAuthentication';
import InfoRoom from './components/InfoRoom';
import ListUser from './components/ListUser';
import Players from './components/Players';
import Popin from './components/Popin';
import Rankings from './components/Rankings';
import SelectionGame from './components/SelectionGame';

// ### Styles ###
import './styles/reset.css';
import './styles/global.css';
import './styles/Home.css';
import './styles/Game.css';

class Morpion extends React.Component {

    constructor() {
        super();

        const socket = io('http://127.0.0.1:3000', {
            reconnection: false,
        });

        this.state = {
            isInviteAccount: null,
            isConnected: false,
            user: null,
            room: null,
            board: [],
            listUser: [],
            socket: socket,
            isPopinOpen: false
        }

        this.joinRoom = this.joinRoom.bind(this);
        this.leaveRoom = this.leaveRoom.bind(this);
        this.togglePopin = this.togglePopin.bind(this);
        this.logOut = this.logOut.bind(this);
    }

    componentWillMount() {
        const socket = this.state.socket;

        socket.on('send board', (board, turn) => {
            this.setState({
                board: board,
                turnPlayer: turn
            });
        });

        this.setConnectedUser();
        this.checkAlreadyExist(socket);
    }

    checkAlreadyExist(socket) {
        const localAuth = localStorage.getItem('idTictactoe');

        // User already has account
        if (localAuth && localAuth !== null) {
            socket.emit('get user', localAuth);
        }
    }

    setConnectedUser() {
        const { socket } = this.state;

        socket.on('valid user', (id, user, isInvite = false) => {
            if (!isInvite) localStorage.setItem('idTictactoe', id);

            this.setState({
                isConnected: true,
                user: user,
                isInviteAccount: isInvite
            });
        });

        // Receive list user
        this.updateListUser(socket);
    }

    logOut() {
        const { socket } = this.state;
        const localAuth = localStorage.getItem('idTictactoe');

        this.setState({
            isInviteAccount: false,
            isConnected: false,
            user: null,
            room: null,
            board: []
        });

        socket.emit('log out');
        if (localAuth) localStorage.removeItem('idTictactoe');
    }

    joinRoom(e) {
        const kindBtn = e.target.id;
        const { socket } = this.state;
        let idWantedRoom = null;

        if (kindBtn === 'joinGameId') {
            idWantedRoom = prompt('Entrez l\'id de la room voulu:');
        }

        socket.emit('join game', idWantedRoom);
        this.updateRoom(socket);
    }

    leaveRoom() {
        const { socket, room } = this.state;

        socket.emit('leave game', room);
        this.setState({ room: null, board: [] });
    }

    updateListUser(socket) {
        socket.on('send list user', listUser => {
            this.setState({ listUser: listUser });
        });
    }

    updateRoom(socket) {
        socket.on('update room', room => {
            this.setState({ room: room });
        });
    }

    togglePopin() {
        const { isPopinOpen } = this.state;
        this.setState({ isPopinOpen: !isPopinOpen });
    }

    renderComponent() {
        const {
            isConnected,
            user,
            room,
            listUser,
            board,
            socket,
            isPopinOpen,
            turnPlayer,
        } = this.state;

        if (!isConnected) {
            return <FormAuthentication socket={socket} />
        } else if (room) {
            return <Game
                socket={socket}
                user={user}
                room={room}
                board={board}
                turnPlayer={turnPlayer}
                leaveRoom={this.leaveRoom} />
        } else if (isConnected === true) {
            return <Home
                socket={socket}
                user={user}
                listUser={listUser}
                isPopinOpen={isPopinOpen}
                logOut={this.logOut}
                joinRoom={this.joinRoom}
                togglePopin={this.togglePopin} />
        }
    }

    render() {
        return (
            this.renderComponent()
        );
    }
}

const Home = ({
    user,
    listUser,
    socket,
    joinRoom,
    logOut,
    isPopinOpen,
    togglePopin
}) =>
    <main className='home'>
        <button className='logout' onClick={logOut}>Log out</button>
        <SelectionGame user={user} joinRoom={joinRoom} />
        <div className='wrap'>
            <Rankings listUser={listUser} />
            <Chat socket={socket} user={user} />
            <ListUser listUser={listUser} me={user.username} />
        </div>
        {isPopinOpen && <Popin toggleOpen={togglePopin} />}
    </main>

const Game = ({ socket, board, room, leaveRoom, user, turnPlayer }) =>
    <main className='game'>
        <h1>TicTacToe</h1>
        {room.state !== 'end' ?
            <div className='contentGame'>
                <InfoRoom room={room} />
                <Players players={room.users} turnPlayer={turnPlayer} />
                <Board socket={socket} board={board} currentUser={user} turnPlayer={turnPlayer} />
                <Chat socket={socket} user={user} />
                <button className='btn-leave' onClick={leaveRoom}>Leave room</button>
            </div> :
            <Win room={room} leaveRoom={leaveRoom} />
        }
    </main>

const Win = ({ room, turnPlayer, leaveRoom }) =>
    <div className='win'>
        <InfoRoom room={room} />
        <button className='btn-leave' onClick={leaveRoom}>Leave room</button>
    </div>


export default Morpion;