
let User 			= require('./../../models/user'),
	secureData 		= require('./../../helpers/secureData'),
	getConfig	 	= require('./../../configApp'),
	request 		= require('request');

let authForm = (req,res) => {
	let url = 'https://github.com/login/oauth/authorize' + '?client_id=' + getConfig('auth--github--id') + '&scope=user&redirect_uri=' + getConfig('auth--github--cb');
	res.redirect(url)
}

let getUser = (req, res) => {
	let params = {
		client_id: getConfig('auth--github--id'),
		client_secret: getConfig('auth--github--secret'),
		code: req.query.code,
		redirect_uri: getConfig('host') + '/auth/github/cb'
	}
	
	// get github access_token
	request.post(
		{
			headers: {'Accept': 'application/json'},
			url:     'https://github.com/login/oauth/access_token',
			form:  params 
		}, 
		function(error, response, body){
			let result = JSON.parse(body);
			
			// get user info from github and save it in db + add session
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
						oauthDataString: JSON.stringify(result),
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
}

module.exports = {
	getLoginForm: authForm,
	getUserInfo: getUser
} 