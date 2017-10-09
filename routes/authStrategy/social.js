
const 
	passport = require('passport')
	User = require('./../../models/user'),
	getConfig = require('./../../configApp'),
	FacebookStrategy = require('passport-facebook').Strategy;;


let fbOpt = {
	clientID: 		getConfig('auth--facebook--FACEBOOK_APP_ID'),
	clientSecret: 	getConfig('auth--facebook--FACEBOOK_APP_SECRET'),
	callbackURL: 	getConfig('auth--facebook--callbackURL')
};



function socialCb(accessToken, refreshToken, profile, done) {
	User.findOrCreate(..., function(err, user) {
		if (err) { return done(err); }
		done(null, user);
	});
}

passport.use(new FacebookStrategy(fbOpt, fbCallback)); 


	// let fbCallback = function (accessToken, refreshToken, profile, cb) {
	// 	console.log(accessToken, refreshToken, profile, cb)
	// }
	// 
app.get('/facebook', passport.authenticate('facebook'))

module.exports = passport;