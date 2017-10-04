
let crypto = require('crypto'),
    bcrypt = require('bcryptjs'),
    algorithm = 'aes192',
    secretPassw = 100,
    secretSession = 'wo';

function encrypt(text){
    var cipher = crypto.createCipher( algorithm, secretSession )
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text){
    var decipher = crypto.createDecipher( algorithm, secretSession )
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}

function hashPassword(text){
    let hash = bcrypt.hashSync(text, secretPassw);
    return hash;
}

function comparePassword(passClient, passServer) {
    return bcrypt.compareSync(passClient, passServer)
}

module.exports = {
    encrypt: encrypt,
    decrypt: decrypt,
    hashPassword: hashPassword,
    comparePassword: comparePassword
}