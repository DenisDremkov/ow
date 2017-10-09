let getConfig 		= require('./../configApp'),
	User 			= require('./../models/user'),
	request 		= require('request'); 
	


module.exports = ( router ) => {
	
	// all users list
	router.get('/getAllUsersList', (req, res) => {
		User.find({}, (err, users) => {
			if (err) {console.log(err);}
			else { res.send(users); }
		});
	});

	// get city data
	router.get('/getData', (req, res) => {
		let city = req.query.city;console.log('data')
		let url = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=bc7ed11acd2463db28ad88e6d9662d83';
		request(url, (err, response, body) => {
			if(err){ res.send({success: false}); } 
			else { console.log(body);res.send({success: true, data: JSON.parse(body)}); }
		});
	});

	// get city temperature
	router.get('/getCityTemperature', (req, res) => {
		let city = req.query.city;
		let url = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=bc7ed11acd2463db28ad88e6d9662d83';
		request(url, (err, response, body) => {
			if(err){ res.send({success: false}); } 
			else { 
				let _body = JSON.parse(body);
				if (_body.cod === '404') {
					res.send({success: false});
				} else {
					res.send({success: true, temp: _body.main.temp}); 	
				}			
			}
		});
	});

	// add to favorite
	router.post('/addToFavorite', (req, res) => {
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
	router.post('/deleteFavoriteCity',  (req, res) => {
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

	return router;
};