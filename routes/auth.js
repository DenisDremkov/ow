
let User = require('./../models/user'),
	securePassword = require('./../helpers/securePassword');
	
module.exports = (router) => {

	router.post('/registr', (req, res) => {
		var newUser = new User({
			username: req.body.username,
			password: securePassword.encrypt(req.body.password)
		});
		newUser.favorite = [];
		newUser.save((err, user) => {
			if (err) { 
				res.send({success: false, msg: 'user not saved', err: err}) 
			} else {
				res.send({success: true, msg: 'user saved'}) 
			}
		})
	});

	router.post('/login', (req, res) => {
		User.findOne({username: req.body.username}, (err, user) => {
			if (err) {res.send({success: false, msg: 'server error - find user'});} 
			if (user) {
				if ( req.body.password === securePassword.decrypt(user.password) ) {
					res.send({success: true, msg: 'user logged', favorite: user.favorite});	
				} else {
					res.send({success: false, msg: 'bad password'});
				}
			} else {
				res.send({success: false, msg: 'yuo not registered'});
			}			
		})
	});

	return router;
}