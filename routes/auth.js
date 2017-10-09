
let User 			= require('./../models/user'),
	securePassword 	= require('./../helpers/securePassword'),
	getConfig	 	= require('./../configApp'),
	request 		= require('request');
	// http 			= require('http');


// let findSessionToken = (req, res, next) => {
// 	console.log('findSessionToken')
// 	console.log(req.session)
// 	next();
// }

let queryUrlToJson = (url) => {
	let obj = {};
	let arr = url.split('&');
	arr.map( (item) => {
		let itemArr = item.split('=');
		obj[ itemArr[0] ] = itemArr[1];
	});	
	return obj;
}

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

	router.get('/github', (req,res) => {
		let url = 'https://github.com/login/oauth/authorize' + '?client_id=' + getConfig('auth--github--id') + '&scope=repo&redirect_uri=' + getConfig('auth--github--cb');
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
				res.redirect('/');
				// request.get(
				// 	{
				// 		// headers: {'access_token': body.access_token, 'scope':'repo,gist', 'token_type':'bearer'},
				// 		url:     'https://api.github.com/user?' 
				// 	},
				// 	function(error, response, body){
				// 		console.log(body);
						
				// 	}
				// )	
			}
		);		
	});

	return router;
}