import React from 'react';
import '../styles/Chat.css';

class Chat extends React.Component {

    constructor(props) {
        super(props);

        const { socket, user } = this.props;

        this.state = {
            user: user,
            inputMsg: '',
            listMessage: [],
            socket: socket
        }

        this.handleChangeMsg = this.handleChangeMsg.bind(this);
    }

    componentWillMount() {
        this.receiveMsg();
    }

    receiveMsg() {
        const socket = this.state.socket;

        socket.on('send list message', listMsg => {
            this.setState({ listMessage: listMsg });
        });

        // Scroll to bottom when receive msg
        if (this.msg) this.msg.scrollIntoView({ behavior: 'smooth' });
    }

    componentDidUpdate() {
        this.receiveMsg();
    }

    handleChangeMsg(e) {
        this.setState({ inputMsg: e.target.value });
    }

    sendMsg = (e) => {
        e.preventDefault();

        const { socket, inputMsg, user } = this.state;

        if (inputMsg.length !== 0) {
            socket.emit('send msg', inputMsg, user.username);
        }

        this.setState({ inputMsg: '' });
    }

    render() {
        const { listMessage, inputMsg, user } = this.state;

        return (
            <div className='chat'>
                <ul className='listMessage' >
                    {listMessage.map((msg, i) =>
                        <li
                            ref={msg => { this.msg = msg; }}
                            key={i}
                            className={msg.username === user.username ? 'me' : ''}
                        >
                            {msg.username !== user.username && <p className='username'>{msg.username}</p>}
                            <p>{msg.text}</p>
                        </li>
                    )}
                </ul>
                <FormChat sendMsg={this.sendMsg} updateMsg={this.handleChangeMsg} currentMsg={inputMsg} />
            </div>
        );
    }
}


const FormChat = ({ sendMsg, updateMsg, currentMsg }) =>
    <form className='form-chat' onSubmit={sendMsg}>
        <input
            type="text"
            onChange={updateMsg}
            value={currentMsg}
            name='message'
            placeholder='Your message'
            autoComplete="off" />
        <input type="submit" value='Send' disabled={!currentMsg ? "disabled" : false} />
    </form>

export default Chat;
