const data = require('../data.json');

class ListUsers {
    constructor() {
        // Add fake users
        this.list = data.users;
    }

    addUser(user) {
        this.list.push(user);
    }

    removeUser(user){
        const indexUser = this.list.indexOf(user);
        this.list.splice(indexUser, 1);
    }

    userIsFound(newUser) {
        const isFound = this.list.some(user =>
            user.username.toLowerCase() === newUser.toLowerCase()
        );

        return isFound;
    }

    findUserById(id) {
        const userFound = this.list.find(user =>
            user.idUser === id
        );

        return userFound;
    }

    updateCountGame(player){
        this.list.map(user => {
            if (player.idUser === user.idUser && player.winner) {
                user.win++;
                user.game++;
            } else if(player.idUser === user.idUser){
                user.game++;
            }
        });
    }
}

module.exports = ListUsers;