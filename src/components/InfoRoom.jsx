import React from 'react';

const InfoRoom = ({ room }) => {
    if (room.state === 'wait') {
        return <div className='infoRoom'>
            <h2>Id room: {room.id}</h2>
            <p>State: {room.state}</p>
        </div>
    } else if (room.state === 'end') {
        return <div className='infoRoom'>
            <p>WIN - {room.game.winner.username}</p>
        </div>
    }

    return null;
}

export default InfoRoom;
