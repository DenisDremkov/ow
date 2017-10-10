'use strict';  
const mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
	username: {
		type: String
	},
	email: {
		type: String
	},
	password: {
		type: String
	},
	favorite: {
		type: Array
	},
	fbId: {
		type: String
	},
	fbUserame: {
		type: String
	},
	ghId: {
		type: String
	},
	ghToken: {
		type: String
	},
	oauthDataString: {
		type: String
	},
	ghAccessToken: {
		type: String
	},
	googleId: {
		type: String
	},
	googleAccessToken: {
		type: String
	}
});

module.exports = mongoose.model('user', UserSchema);