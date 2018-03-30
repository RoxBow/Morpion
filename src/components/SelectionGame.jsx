import React from 'react';

const SelectionGame = ({ user, joinRoom }) =>
    <div className='wrapperSelection'>
        <h1>TicTacToe</h1>
        <h2>Hi {user.username} !</h2>
        <div className='wrapBtn'>
            <button id='joinGame' onClick={joinRoom}>Random game</button>
            <button id='joinGameId' onClick={joinRoom}>Game with id</button>
        </div>
    </div>

export default SelectionGame;
