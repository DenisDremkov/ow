
let	cryptData 	= require('./cryptData'),
	User 		= require('./user.js');

module.exports =  function(req, res, next) {
	
	let cookie = req.cookies.sessionOw;

	if (cookie) {
		let arr = cookie.split('.');
		let userId = arr[0];
		let decryptedId = cryptData.decrypt(arr[1]);
		if (userId === decryptedId) {
			User.findOne({_id:userId}, function(err, user) {
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