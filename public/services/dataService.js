'use strict';

myAppModule.service('dataService', function($http) {

	let _favorites = null;
	
	this.setFavorites = data => { 
		if (!_favorites) {	_favorites = []; }
		data.map( item => { _favorites.push({name: item}); })
	};
	this.getFavorites = data => { return _favorites; };

	this.getData = function(city) {
		return $http.get( 'http://localhost:3000/getData', {params: {city: city}});	
	};
	this.getCityTemperature = function(city) {
		return $http.get( 'http://localhost:3000/getCityTemperature', {params: {city: city}});		
	};

	this.getAllTemperature = (cities) => {
		let config = {}
		for (let i = 0; i < cities.length; i++) {
			config[ cities[i].name ] = $http.get( 'http://localhost:3000/getCityTemperature', {params: {city: cities[i].name}});
		}
		return Promise.props(config)
	}
	this.addToFavorite= function(city, username) {
		return $http.post( 'http://localhost:3000/addToFavorite', {city: city, username: username});
	};

	this.deleteFavoriteCity = function(city, username) {
		return $http.post( 'http://localhost:3000/deleteFavoriteCity', {city: city, username: username});
	};
});
