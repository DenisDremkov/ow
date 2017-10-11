'use strict';


const 
	express 		= require('express'),
	app 			= express(),
	router 			= express.Router(),
	bodyParser 		= require('body-parser'),
	mongoose 		= require('mongoose'),
	cookieParser 	= require('cookie-parser'),
	User 			= require('./models/user'),
	getConfig 		= require('./configApp'),
	auth 			= require('./routes/auth')(router),
	api 			= require('./routes/api')(router),
	pay 			= require('./routes/pay')(router);


// mongo
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/wo', { useMongoClient: true, promiseLibrary: global.Promise }, (err) => {
	if (err) {console.log(err)}
	else {console.log('mongodb success connect on mongodb://localhost:27017/wo')}
});

// view
app.set('view engine', 'pug');

// middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cookieParser());

// auth
app.use('/auth', auth)

// api
app.use('/api', api);

// pay
app.use('/pay', pay);


// static
app.use(express.static('public'));


app.listen(3000, () => console.log('Example app listening on port 3000!') );







