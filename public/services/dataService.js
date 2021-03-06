'use strict';

myAppModule.service('dataService', [ '$http', 'configService', function($http, configService) {

	let _favorites = null;
	
	this.setFavorites = data => { 
		if (!_favorites) {	_favorites = []; }
		data.map( item => { _favorites.push({name: item}); })
	};
	this.getFavorites = data => { return _favorites; };

	this.getData = function(city) {
		return $http.get( configService.getValue('host') + '/api/getData', {params: {city: city}});	
	};
	this.getCityTemperature = function(city) {
		return $http.get( configService.getValue('host') + '/api/getCityTemperature', {params: {city: city}});		
	};

	this.getAllTemperature = (cities) => {
		let config = {}
		for (let i = 0; i < cities.length; i++) {
			config[ cities[i].name ] = $http.get( configService.getValue('host') + '/api/getCityTemperature', {params: {city: cities[i].name}});
		}
		return Promise.props(config)
	}
	this.addToFavorite= function(city, username) {
		return $http.post( configService.getValue('host') + '/api/addToFavorite', {city: city, username: username});
	};

	this.deleteFavoriteCity = function(city, username) {
		return $http.post( configService.getValue('host') + '/api/deleteFavoriteCity', {city: city, username: username});
	};
}]);

