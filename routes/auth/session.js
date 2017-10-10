let User 			= require('./../../models/user'),
	secureData 		= require('./../../helpers/secureData');

module.exports =  (req, res) => {
	// TODO add session for local auth (not express-session)
	if ( req.cookies['ow-auth']) {
		
		// parse session value
		let array = req.cookies['ow-auth'].split('.');
		let decrypt = secureData.decrypt(array[1]);
		let decryptArray = decrypt.split('---');
		if (array[0] === decryptArray[1]) {
			let typeFind;
			
			// detect session type for correct finding
			if ( decryptArray[0] === 'github' ) { 
				typeFind = { ghId: array[0] }; 
			}
			
			// find user
			User.findOne(typeFind, (err, user) => {
				if (err) { res.send({success: false, msg: err})
				}
				if (user) { res.send({success: true, user: user})
				} else { res.send({success: false, msg: 'not find'}); }
			});
		}
	} else {
		res.send({success: false, msg: 'session not set'});
	}		
}