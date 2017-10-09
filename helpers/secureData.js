const 
    User            = require('./../models/user'),
    crypto          = require('crypto'),
    saltHash        = require('./../configApp')('auth--secureUser--salt--hash'),
    chiperAlgorithm = require('./../configApp')('auth--secureUser--password--chiperAlgorithm');

let encrypt = (text) => {
    var cipher = crypto.createCipher( chiperAlgorithm, saltHash )
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}

let decrypt = (text) => {
    var decipher = crypto.createDecipher( chiperAlgorithm, saltHash )
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}

module.exports = {
    encrypt: encrypt,
    decrypt: decrypt
}