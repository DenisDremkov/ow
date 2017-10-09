
'use strict';

const _host = 'http://632c646c.ngrok.io',   // + change in client config angular configService!!!!
	crypto = require('crypto');

const config = {
	host:  _host,
	auth: {
		secureUser: {
			salt: {
				value: 'secret',						// change after clear db (not synchraniz)
				hashAlgoritm: 'sha256',					// change after clear db (not synchraniz)
				hash: undefined
			},
			password: {
				chiperAlgorithm: 'aes256'					// not change
			}
		},
		facebook: {
			FACEBOOK_APP_ID: 	'1534206049955977', 
			FACEBOOK_APP_SECRET:'1f711752f2ab8e52236c8f44bff6c3f3',
			callbackURL: _host + '/auth/facebook/cb'
		},
		github: {
			id: 	'0ed9ad57c32b7b8ad7ef', 
			secret:'4b1bca88d7cee6a7105e50a892e97aa0c826dbee',
			cb: _host + '/auth/github/cb'
		}
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