
let User 			= require('./../../models/user'),
	secureData 		= require('./../../helpers/secureData'),
	getConfig	 	= require('./../../configApp'),
	request 		= require('request'),
	buildUrl 		= require('build-url');

let authForm = (req,res) => {
	let url = buildUrl('https://accounts.google.com/o/oauth2/v2/auth', {
		queryParams: {
			// scope: 'https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.metadata.readonly',
			// scope: 'https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile',
			scope: 'https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fgmail.readonly',
			// https://www.googleapis.com/auth/gmail.readonly
			// https://           www.googleapis.com/  auth/  userinfo.profile
			// scope: 'https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.metadata.readonly https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile',
			access_type: 'offline',
			include_granted_scopes: true,
			state: 'state_parameter_passthrough_value',
			redirect_uri: getConfig('auth--google--cb'),
			response_type: 'code',
			client_id: getConfig('auth--google--id')
		}
	})
	res.redirect(url); 
}

// https://www.googleapis.com/oauth2/v1/userinfo'?alt=json'
let getUser = (req, res) => {
	let params = {
		client_id: getConfig('auth--google--id'),
		client_secret: getConfig('auth--google--secret'),
		code: req.query.code,
		redirect_uri: getConfig('auth--google--cb'),
		grant_type: 'authorization_code'
	}
	// get code
	request.post(
		{
			headers: {'Accept': 'application/json'},
			url: 'https://www.googleapis.com/oauth2/v4/token',
			form:  params 
		}, 
		function(error, response, body) {
			let result = JSON.parse(body);	
			if (result.access_token) {
				request(
					{
						uri: 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + result.access_token,
						method: 'GET'
					}, 
					function (err, response, userString) {
						if (err) {res.send(err)}
						let userObj = JSON.parse(userString)
						newUser = new User({
							username: String(userObj.given_name) + String(userObj.family_name),
							googleId: userObj.id,
							oauthDataString: userString,
							googleAccessToken: result.access_token,
							favorite: []
						});
						newUser.save((err, user) => {
							if (user) {console.log('user was saved')}
						})
						res.cookie('ow-auth', String(userObj.id) + '.' + secureData.encrypt('google---' + String(userObj.id)), { maxAge: 900000, httpOnly: false });
						res.redirect('/');
					}
				);
			}	
		}
	);		
}

module.exports = {
	getLoginForm: authForm,
	getUserInfo: getUser
} 