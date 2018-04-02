import React from 'react';
import '../styles/FormAuthentication.css';

import ErrorMessage from './ErrorMessage';

class FormAuthentication extends React.Component {

    constructor(props) {
        super(props);

        const { socket } = this.props;

        this.state = {
            inputUsername: '',
            inputPassword: '',
            error: '',
            selectedOption: 'invite',
            socket: socket
        }

        this.handleChangeUsername = this.handleChangeUsername.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.handleFormAuthenticate = this.handleFormAuthenticate.bind(this);
    }

    handleChangeUsername(e) {
        this.setState({ inputUsername: e.target.value });
    }

    handleChangePassword(e) {
        this.setState({ inputPassword: e.target.value });
    }

    handleOptionChange(e) {
        this.setState({ selectedOption: e.target.value });
    }

    handleFormAuthenticate = (e) => {
        e.preventDefault();

        const {
            socket,
            inputUsername,
            inputPassword,
            selectedOption
        } = this.state;

        socket.emit('save user', inputUsername, inputPassword, selectedOption);

        socket.on('error username', errorMessage => {
            this.setState({ error: errorMessage});
        });

        socket.on('error password', errorMessage => {
            this.setState({ error: errorMessage});
        });
    }

    render() {
        const {
            inputUsername,
            inputPassword,
            selectedOption,
            error
        } = this.state;

        return (
            <main className='authentication'>
                <h1>Choose a kind of account</h1>
                <ChoiceKindAccount
                    handleOptionChange={this.handleOptionChange}
                    selectedOption={selectedOption}
                />
                {error && <ErrorMessage error={error} />}
                <AccountForm
                    handleFormAuthenticate={this.handleFormAuthenticate}
                    handleChangeUsername={this.handleChangeUsername}
                    handleChangePassword={this.handleChangePassword}
                    inputUsername={inputUsername}
                    inputPassword={inputPassword}
                    selectedOption={selectedOption}
                />
            </main>
        );
    }
}

const ChoiceKindAccount = ({ handleOptionChange, selectedOption }) =>
    <div className='wrapChoice'>
        <p>
            <input
                type='radio'
                id='invite'
                name='kindAccount'
                value='invite'
                onChange={handleOptionChange}
                checked={selectedOption === 'invite'}
            />
            <label htmlFor='invite'>Invite</label>
        </p>
        <p>
            <input
                type='radio'
                id='account'
                name='kindAccount'
                value='account'
                onChange={handleOptionChange}
                checked={selectedOption === 'account'}
            />
            <label htmlFor='account'>Account</label>
        </p>
    </div>

const AccountForm = ({
    handleFormAuthenticate,
    handleChangeUsername,
    handleChangePassword,
    inputUsername,
    inputPassword,
    selectedOption
}) =>
    <form className='form-authenticate' onSubmit={handleFormAuthenticate}>
        <p>
            <label htmlFor='username'>Username</label>
            <input
                type='text'
                onChange={handleChangeUsername}
                value={inputUsername}
                name='username'
                id='username'
                placeholder='bloublou'
                autoFocus
            />
        </p>
        {selectedOption !== 'account' &&
            <input type='submit' value='Save' disabled={!inputUsername && !inputPassword ? "disabled" : false} />
        }

        {selectedOption === 'account' &&
            <div>
                <p>
                    <label htmlFor='password'>Password</label>
                    <input
                        type='text'
                        onChange={handleChangePassword}
                        value={inputPassword}
                        id='password'
                        name='password'
                    />
                </p>
                <input type='submit' value='Save' disabled={!inputUsername && !inputPassword ? "disabled" : false} />
            </div>
        }
    </form>

export default FormAuthentication;
