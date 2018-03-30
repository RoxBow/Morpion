const bcrypt = require('bcrypt');

exports.cryptPassword = function(password, callback) {
    bcrypt.genSalt(10, function(err, salt) {
     if (err) 
       return callback(err);
 
     bcrypt.hash(password, salt, function(err, hash) {
       return callback(err, hash);
     });
   });
 };

exports.comparePassword = (plainPass, hashword, callback) => {
    bcrypt.compare(plainPass, hashword, (err, isPasswordMatch) => {
        return err == null ?
            callback(null, isPasswordMatch) :
            callback(err);
    });
};