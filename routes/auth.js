
let User 			= require('./../models/user'),
	secureData 		= require('./../helpers/secureData'),
	getConfig	 	= require('./../configApp'),
	request 		= require('request'),
	https			= require('https');

module.exports = (router) => {

	router.get('/session', (req, res) => {
		if ( req.cookies['ow-auth']) {
			let array = req.cookies['ow-auth'].split('.');
			let decrypt = secureData.decrypt(array[1]);
			let decryptArray = decrypt.split('---');
			if (array[0] === decryptArray[1]) {
				let typeFind;
				if (decryptArray[0] === 'github') { typeFind = {ghId: array[0]}; }
				User.findOne(typeFind, (err, user) => {
					if (err) {
						res.send({success: false, msg: err})
					}
					if (user) {
						res.send({success: true, user: user})
					} else {
						res.send({success: false, msg: 'not find'})
					}
				})
			}
		} else {
			res.send({success: false, msg: 'session not set'})
		}		
	});

	router.post('/registr', (req, res) => {
		var newUser = new User({
			username: req.body.username,
			password: secureData.encrypt(req.body.password)
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
				if ( req.body.password === secureData.decrypt(user.password) ) {
					res.send({success: true, msg: 'user logged', favorite: user.favorite});	
				} else {
					res.send({success: false, msg: 'bad password'});
				}
			} else {
				res.send({success: false, msg: 'yuo not registered'});
			}			
		})
	});

	router.get('/github', (req,res) => {
		let url = 'https://github.com/login/oauth/authorize' + '?client_id=' + getConfig('auth--github--id') + '&scope=user&redirect_uri=' + getConfig('auth--github--cb');
		res.redirect(url)
	})

	router.get('/github/cb', (req, res) => {
		let params = {
			client_id: getConfig('auth--github--id'),
			client_secret: getConfig('auth--github--secret'),
			code: req.query.code,
			redirect_uri: getConfig('host') + '/auth/github/cb'
		}
		request.post(
			{
				headers: {'Accept': 'application/json'},
				url:     'https://github.com/login/oauth/access_token',
				form:  params 
			}, 
			function(error, response, body){
				let result = JSON.parse(body);
				request(
					{
						headers: {'User-Agent': 'request'},
						uri: 'https://api.github.com/user?access_token=' + result.access_token,
						method: 'GET'
					}, 
					function (err, response, body) {
						if (err) {res.send(err)}
						let result = JSON.parse(body)
						newUser = new User({
							username: result.login,
							ghId: result.id,
							ghStringData: JSON.stringify(result),
							ghAccessToken: result.access_token,
							favorite: []
						});
						newUser.save((err, user) => {
						})
						res.cookie('ow-auth', String(result.id) + '.' + secureData.encrypt('github---' + String(result.id)), { maxAge: 900000, httpOnly: false });
						res.redirect('/');
					}
				);	
			}
		);		
	});

	return router;
}