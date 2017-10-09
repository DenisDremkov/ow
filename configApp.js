
'use strict';

const host = 'http://69cf28fb.ngrok.io',
	crypto = require('crypto');

const config = {
	
	auth: {
		secureUser: {
			salt: {
				value: 'secret',
				hashAlgoritm: 'sha256',					// not change
				hash: undefined
			},
			password: {
				chiperAlgorithm: 'aes256'					// not change
			}
		},
		facebook: {
			FACEBOOK_APP_ID: 	'1534206049955977', 
			FACEBOOK_APP_SECRET:'1f711752f2ab8e52236c8f44bff6c3f3',
			callbackURL: host + '/auth/facebook/cb'
		},
		github: {},
		google: {}
	},

	
};

// create hash salt
config.auth.secureUser.salt.hash = crypto
										.createHash(config.auth.secureUser.salt.hashAlgoritm)
										.update(config.auth.secureUser.salt.value)
										.digest('hex');

module.exports = ( string ) => {
	let path = string.split('--'),
		configValue = config;
	path.map( ( prop ) => { 
		configValue = configValue[ prop ]; 
		if ( !configValue ) {throw 'Error in configuration request - ' + string; }
	});
	return configValue;
}