'use strict';

const 
	express 		= require('express'),
	app 			= express(),
	router 			= express.Router(),
	bodyParser 		= require('body-parser'),
	mongoose 		= require('mongoose'),
	cookieParser 	= require('cookie-parser'),
	User 			= require('./models/user'),
	session         = require('express-session'),
	passport 		= require('passport'),
	FacebookStrategy = require('passport-facebook').Strategy,
	getConfig 		= require('./configApp'),
	// auth 			= require('./routes/auth')(router),
	api 			= require('./routes/api')(router);

// mongo
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/wo', { useMongoClient: true, promiseLibrary: global.Promise }, (err) => {
	if (err) {console.log(err)}
	else {console.log('mongodb success connect on mongodb://localhost:27017/wo')}
});

// middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

passport.serializeUser(function(user, done) {
	console.log(user)
  done(null, user.id || user.fbId);
});

passport.deserializeUser(function(id, done) {
	console.log(id)
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// auth
let fbOpt = {
	clientID: 		getConfig('auth--facebook--FACEBOOK_APP_ID'),
	clientSecret: 	getConfig('auth--facebook--FACEBOOK_APP_SECRET'),
	callbackURL: 	getConfig('auth--facebook--callbackURL'),
	profileFields: ['id', 'displayName', 'email']
};



function socialCb(accessToken, refreshToken, profile, done) {
	console.log('1 -', accessToken )
	console.log('2 -', refreshToken )
	console.log('3 -', profile )


	User.find({fbId: profile._json.id}, function(err, user) {
		console.log(profile)
		if (err) { return done(err); }
		if (user) {
			done(null, user);
		} else {
			newUser = new User({fbId: profile._json.id, username: profile.displayName});
			newUser.save((err) => {
				if (err) {done(null, null)}
				else done(null, newUser)
			})
		}
	});
}
passport.use(new FacebookStrategy(fbOpt, socialCb));
app.get('/auth/facebook/cb',  
	passport.authenticate('facebook', {successRedirect: '/', failureRedirect: '/login' } )
)

app.get('/auth/facebook', passport.authenticate('facebook'))


// app.use('/auth', auth);

// api
app.use('/api', api);

// static
app.use(express.static('public'));


app.listen(3000, () => console.log('Example app listening on port 3000!') );