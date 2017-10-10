
let User 			= require('./../../models/user'),
	secureData 		= require('./../../helpers/secureData');

module.exports =  (req, res) => {
	User.findOne({username: req.body.username}, (err, user) => {
		if (err) {res.send({success: false, msg: 'server error - find user'});} 
		if (user) {
			if ( req.body.password === secureData.decrypt(user.password) ) {
				res.send({success: true, msg: 'user logged', favorite: user.favorite});	
			} else {
				res.send({success: false, msg: 'bad password'});
			}
		} else {
			res.send({success: false, msg: 'yuo not registered'});
		}			
	})
};

