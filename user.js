
const mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	favorite: {
		type: Array
	},
});

module.exports = mongoose.model('user', UserSchema);