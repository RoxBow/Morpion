import React from 'react';
import '../styles/Rankings.css';

const Rankings = ({ listUser }) => {
    listUser = listUser.slice(0, 5);
    
    const sortListUser = listUser.sort((a, b) => {
        return parseInt(b.win / b.games * 100, 10) - parseInt(a.win / a.games * 100, 10);
    });

    return <table className='rankings'>
        <caption>Top 5 players</caption>
        <tbody>
            <tr>
                <th>Place</th>
                <th>Username</th>
                <th>Win</th>
                <th>Game</th>
                <th>Ratio win (%)</th>
            </tr>
            {sortListUser.map((user, i) =>
                <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{user.username}</td>
                    <td>{user.win}</td>
                    <td>{user.games}</td>
                    <td>{parseInt(user.win / user.games * 100, 10)}</td>
                </tr>
            )}
        </tbody>
    </table>
}

export default Rankings;