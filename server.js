const express 		= require('express'),
	app 			= express(),
	bodyParser 		= require('body-parser'),
	request 		= require('request'),
	mongoose 		= require('mongoose'),
	cookieParser 	= require('cookie-parser'),
	crypto			= require('crypto'),
	User 			= require('./user'),
	session 		= require('./sessionMiddleware'),
	cryptData		= require('./cryptData');

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

// static
app.use(express.static('public'));

// session
app.get('/session', session, (req, res) => {
	if (res.sessionUser) {res.send({username: res.sessionUser.username, favorite: res.sessionUser.favorite,})}
	else {res.send()}
});

// registr
app.post('/registr', (req, res) => {
	var newUser = new User(req.body);
	newUser.favorite = [];
	newUser.save((err, user) => {
		if (err) { 
			res.send({success: false, msg: 'user not saved', err: err}) 
		} else {
			res.send({success: true, msg: 'user saved'}) 
		}
	})
});

// login
app.post('/login', (req, res) => {
	User.findOne({username: req.body.username}, (err, user) => {
		if (err) {res.send({success: false, msg: 'server error - find user'});} 
		if (user) {
			if (user.password === req.body.password) {
				let token = String(user._id) + '.' + cryptData.encrypt(String(user._id));
				res.send({success: true, msg: 'user logged', token: token, favorite: user.favorite});	
			} else {
				res.send({success: false, msg: 'bad password'});
			}
		} else {
			res.send({success: false, msg: 'yuo not registered'});
		}			
	})
});


// all users list
app.get('/getAllUsersList', (req, res) => {
	User.find({}, (err, users) => {
		if (err) {console.log(err);}
		else { res.send(users); }
	});
});

// get city data
app.get('/getData', (req, res) => {
	let city = req.query.city;
	let url = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=bc7ed11acd2463db28ad88e6d9662d83';
	request(url, (err, response, body) => {
		if(err){ res.send({success: false}); } 
		else { res.send({success: true, data: JSON.parse(body)}); }
	});
});

// get city temperature
app.get('/getCityTemperature', (req, res) => {
	let city = req.query.city;
	let url = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=bc7ed11acd2463db28ad88e6d9662d83';
	request(url, (err, response, body) => {
		if(err){ res.send({success: false}); } 
		else { 
			res.send({success: true, temp: (JSON.parse(body)).main.temp}); 
		}
	});
});

// add to favorite
app.post('/addToFavorite', (req, res) => {
	User.findOne({username: req.body.username}, (err, user) => {
		if (err) {
			res.send({success: false, msg: 'error'})
		} 
		if (user) {
			if (!user.favorite) { user.favorite = []; }
			user.favorite.push(req.body.city);
			user.save()
			res.send({success: true, msg: 'city added to favorite'})
		} else {
			res.send({success: false, msg: 'error'})
		}
	})
});

// delete favorite
app.post('/deleteFavoriteCity',  (req, res) => {
	User.findOne({username: req.body.username}, (err, user) => {
		if (err) {
			handleError(err);
			res.send({success: false, msg: 'error'})
		} else {
			let arr = user.favorite;
			let index = arr.indexOf(req.body.city);
			arr.splice(index, 1); 
			user.markModified('favorite');
			user.save()
			res.send({success: true, msg: 'city removed from favorite'})
		}
	})
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});