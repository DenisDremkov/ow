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

	this.getCityTemperature = function(city) {
		let promise = new Promise(function (resolve, reject) {
	        let xmlHttp = new XMLHttpRequest();
	        xmlHttp.addEventListener("load", function() {resolve(xmlHttp.responseText)}); 
	        xmlHttp.addEventListener("error", function() {reject(xmlHttp.responseText)});
    		xmlHttp.open( 'GET', 'http://localhost:3000/getCityTemperature' +'?city=' + city, true ); 
		    xmlHttp.send( null );
	    });
		return promise;
	};

	this.addToFavorite= function(city, username) {
		return $http.post( 'http://localhost:3000/addToFavorite', {city: city, username: username});
	};

	this.deleteFavoriteCity = function(city, username) {
		return $http.post( 'http://localhost:3000/deleteFavoriteCity', {city: city, username: username});
	};
});
