
const crypto = require('crypto'),
    bcrypt = require('bcryptjs'),
    algorithm = 'aes192',
    secretPassw = 100,
    secretSession = 'wo';

let encrypt = (text) => {
    var cipher = crypto.createCipher( algorithm, secretSession )
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}

let decrypt = (text) => {
    var decipher = crypto.createDecipher( algorithm, secretSession )
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}

let hashPassword = (text) => {
    let hash = bcrypt.hashSync(text, secretPassw);
    return hash;
}

let comparePassword = (passClient, passServer)  => {
    return bcrypt.compareSync(passClient, passServer)
}

module.exports = {
    encrypt: encrypt,
    decrypt: decrypt,
    hashPassword: hashPassword,
    comparePassword: comparePassword
}