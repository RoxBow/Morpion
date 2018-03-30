import React from 'react';
import '../styles/Board.css';

const Board = ({ socket, board, turnPlayer, currentUser }) => {

    const sendPiece = (e) => {
        if (turnPlayer !== currentUser.username) {
            return;
        }

        const currentColumn = e.target.cellIndex;
        const currentRow = e.target.parentNode.rowIndex;
        socket.emit('add piece', currentRow, currentColumn);
    }

    return <table className='tictactoe'>
        <tbody>
            {board.map((rowData, i) =>
                <tr key={i}>
                    {rowData.map((cellData, j) =>
                        <td key={j} onClick={(e) => sendPiece(e)} className={`active${cellData}`}></td>
                    )}
                </tr>
            )}
        </tbody>
    </table>
}

export default Board;