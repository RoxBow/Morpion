import React from 'react';
import '../styles/ListUser.css';

const ListUser = ({ listUser, me }) =>
    <ul className='listUser'>
        <li className='titleList'>User connected</li>
        {listUser.map((user, i) =>
            <li key={i} className={me === user.username ? 'me' : ''}>{user.username}</li>
        )}
    </ul>

export default ListUser;
