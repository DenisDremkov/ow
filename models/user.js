'use strict';  
const mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true
	},
	email: {
		type: String,
		unique: true,
		required: false
	},
	password: {
		type: String,
		required: true
	},
	favorite: {
		type: Array
	},
	fbId: {
		type: String
	}
});

module.exports = mongoose.model('user', UserSchema);