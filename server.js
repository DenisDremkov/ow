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

// достает из запроса ключ сессии
passport.serializeUser(function(user, done) {
	console.log('desirialize', user)
  	done(null, user.id || user.fbId);
});

// поиск по ключю в бд
passport.deserializeUser(function(id, done) {
	console.log('serialize', id)
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


passport.use(new FacebookStrategy(
	{
		clientID: 		getConfig('auth--facebook--FACEBOOK_APP_ID'),
		clientSecret: 	getConfig('auth--facebook--FACEBOOK_APP_SECRET'),
		callbackURL: 	getConfig('auth--facebook--callbackURL'),
		profileFields: ['id', 'displayName', 'email']
	},
	function(accessToken, refreshToken, profile, done) {
		
		User.findOne({fbId: profile.id}, function(err, user) {
			if (err) { return done(err); }
			if (user) {
				console.log('find user', user)
				done(null, user);	
			} else {
				console.log( 'fb registr' )
				// console.log('daaaaaaaaaaaa')
				let newUser = new User({
					username: profile.displayName,
					fbId: 'fb-' + profile.id
				})
				newUser.save((err,user) => {
					if (err) {done(null, null);}
					if (user) {done(null, user)}
				})
			}
		});
	}
));

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/cb',  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));

// api
app.use('/api', api);

// static
app.use(express.static('public'));


app.listen(3000, () => console.log('Example app listening on port 3000!') );







