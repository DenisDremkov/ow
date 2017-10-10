
let User 			= require('./../../models/user'),
	secureData 		= require('./../../helpers/secureData');

module.exports = (req, res) => {
	var newUser = new User({
		username: req.body.username,
		password: secureData.encrypt(req.body.password),
		favorite: []
	});
	newUser.save((err, user) => {
		if (err) { 
			res.send({success: false, msg: 'user not saved', err: err}) 
		} else {
			res.send({success: true, msg: 'user saved'}) 
		}
	})
};

	