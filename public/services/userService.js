'use strict';

// TODO replace hostname to common config or backend
myAppModule.service('userService', [ '$http', 'configService', function($http, configService) {
	
	// user data
	let _data = {
		username: undefined,
		isLogged: undefined,
		dataUser: undefined
	}	
	
	// session
	this.getSession = () => {return $http.get('/auth/session'); }

	// username
	this.setUsername = value => {  _data.username = value; };
	this.getUsername = () => { return _data.username; };

	// login status
	this.setLoginStatus = value => {  _data.isLogged = value; };		
	this.getLoginStatus = () => { return  _data.isLogged; };

	// user data
	this.setDataUser = value => {  _data.dataUser = value; };
	this.getDataUser = () => { return  _data.dataUser; };
	
	// get login
	this.login 	= user => { return $http.post( configService.getValue('host') + '/auth/login', user);};
	
	// registr
	this.registr = newUser => {	return $http.post( configService.getValue('host') + '/auth/registr', newUser);};
	
	// all users list
	this.getAllUsersList = () => {	return $http.get( configService.getValue('host') + '/api/getAllUsersList');};
}]);
