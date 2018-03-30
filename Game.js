class Game {
    constructor(size) {
        this.countHit = 0;
        this.currentTurn = 1;
        this.board = [
            []
        ];
        this.player1 = null;
        this.player2 = null;
        this.generateTable(size);
    }

    generateTable(size) {

        for (let i = 0; i < size; i++) {
            this.board[i] = [];
            for (let j = 0; j < size; j++) {
                this.board[i][j] = 0;
            }
        }
    }

    addPiece(posX, posY) {
        if (this.board[posX][posY] !== 0) return false;

        // attribute cell to player
        this.board[posX][posY] = this.currentTurn;

        const isWin = this.isWin(posX, posY, this.currentTurn);

        if (isWin) {
            if (this.currentTurn === 1) {
                this.player1.winner = true;
            } else {
                this.player2.winner = true
            }

            return;
        }

        // Update count play
        this.countHit++;

        // Update turn
        this.currentTurn = this.currentTurn === 1 ? 2 : 1;
    }

    isWin(x, y, player) {
        const board = this.board;

        if (this.countHit > 3) {
            if (checkHorizontal(y, player, board) ||
                checkVertical(x, player, board)) {
                return true;
            }
        }

        return false;
    }
}

const checkHorizontal = (y, player, rows) => {
    for (let i = 0, iLength = rows.length; i < iLength; i++) {
        if (rows[i][y] !== player) return false;
    }

    return true;
}

const checkVertical = (x, player, rows) => {
    for (let i = 0, iLength = rows[x].length; i < iLength; i++) {
        if (rows[x][i] !== player) return false;
    }
    return true;
}

const checkDiagonal = (x, y, player, rows) => {

    let coords = [];

    switch (y) {
        case 0:
            if (x === 1) return false;
            coords.push([x, y], [x + 1, y + 1], [x + 2, y + 2]);
            break;
        case 1:
            if (x === 1) {
                coords.push([x - 1, y + 1], [x, y], [x + 1, y - 1]);
                coords.push([x + 1, y - 1], [x, y], [x - 1, y + 1]);
            }
            break;
        case 2:
            if (x === 1) return false;
            coords.push([x - 2, y - 2], [x - 1, y - 1], [x, y]);
            break;

    }

    console.log(coords)

    let match;
    for (let i = 0, iLength = coords.length; i < iLength; i++) {
        for (let j = 0, jLength = coords[i].length; j < jLength; j++) {
            match = true;
            const x = coords[i][j][1];
            const y = coords[i][j][0];
            if (rows[y][x] !== player) {
                match = false;
                break
            }
        }
        if (match) return true;
    }

    return false;
}

module.exports = Game;