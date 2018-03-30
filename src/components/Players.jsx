import React from 'react';

const Players = ({ players, turnPlayer }) =>
    <div className='players'>
        {players.map((player, i) =>
            <p
                className={player.username === turnPlayer ? 'turn' : ''}
                key={i}>
                {player.username}
            </p>
        )}
    </div>

export default Players;
