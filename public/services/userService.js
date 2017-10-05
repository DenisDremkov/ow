'use strict';

myAppModule.service('userService', function($http, $q) {
		
	let _username = undefined;
	let _isLogged = undefined;

	this.setUsername = value => { _username = value; };
	this.getUsername = () => { return _username; };

	this.setLoginStatus = value => { _isLogged = value; };		
	this.getLoginStatus = () => { return _isLogged; };

	this.login = user => {	return $http.post('http://localhost:3000/login', user);};
	this.registr = newUser => {	return $http.post('http://localhost:3000/registr', newUser);};
	
	this.getAllUsersList = () => {	return $http.get('http://localhost:3000/getAllUsersList');};
});