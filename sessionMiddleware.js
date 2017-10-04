
const cryptData = require('./cryptData'),
	User 		= require('./user.js');

module.exports =  (req, res, next) => {
	
	let token = req.headers.sessiontoken;

	if (token) {
		let arr = token.split('.');
		let userId = arr[0];
		let decryptedId = cryptData.decrypt(arr[1]);
		if (userId === decryptedId) {
			User.findOne({_id:userId}, (err, user) => {
				if (err) {next()} 
				if (user) {
					res.sessionUser = user;
					next();
				} else {
					next();
				}			
			})
		}
	} else {
		next();	
	}
}