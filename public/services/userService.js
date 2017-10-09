'use strict';

// TODO replace hostname to common config or backend
myAppModule.service('userService', function($http, $q) {
		
	let _username = undefined;
	let _isLogged = undefined;

	this.setUsername = value => { _username = value; };
	this.getUsername = () => { return _username; };

	this.setLoginStatus = value => { _isLogged = value; };		
	this.getLoginStatus = () => { return _isLogged; };

	this.socialAuth = socialName => { return $http.get('http://localhost:3000/auth/' + socialName); };
	
	this.login = user => { return $http.post('http://localhost:3000/auth/login', user);};
	
	this.registr = newUser => {	return $http.post('http://localhost:3000/auth/registr', newUser);};
	
	this.getAllUsersList = () => {	return $http.get('http://localhost:3000/api/getAllUsersList');};
});
