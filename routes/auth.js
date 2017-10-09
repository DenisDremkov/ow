

// let getConfig 		= require('./../configApp'),
// 	securePassword 	= require('./../helpers/securePassword'),
// 	User 			= require('./../models/user'),
// 	localStrategy   = require('./authStrategy/local'); 
	


// module.exports = ( router ) => {
	
// 	// registr
// 	router.post('/registr', (req, res) => {
// 		var newUser = new User({
// 			username: req.body.username,
// 			password: securePassword.encrypt(req.body.password)
// 		});
// 		console.log(newUser)
// 		newUser.favorite = [];
// 		newUser.save((err, user) => {
// 			if (err) { 
// 				res.send({success: false, msg: 'user not saved', err: err}) 
// 			} else {
// 				res.send({success: true, msg: 'user saved'}) 
// 			}
// 		})
// 	})

// 	let socialCallback = function (accessToken, refreshToken, profile, cb) {
// 		console.log(accessToken, refreshToken, profile, cb)
// 	}

// 	// login
// 	router.post('/login', localStrategy);
// 	router.get('/facebook', () => {
// 		console.log('fb strategy')
// 	});
// 	router.get('/github', (req, res) => {console.log('github'); res.send({test: 'github'})	});
// 	router.get('/google', (req, res) => {console.log('google'); res.send({test: 'google'})	});
// 	router.get('/youtube', (req, res) => {console.log('youtube'); res.send({test: 'youtube'})	});

	
// 	// passport.use(new FacebookStrategy(fbOpt, fbCallback))
// 	// app.get('/auth/facebook/cb', passport.authenticate('facebook'))






// 	return router;
// };