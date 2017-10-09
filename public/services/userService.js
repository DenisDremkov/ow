'use strict';

// TODO replace hostname to common config or backend
myAppModule.service('userService', [ '$http', 'configService', function($http, configService) {
	let _data = {
		username: undefined,
		isLogged: undefined,
		dataUser: undefined
	}	
	

	this.getSession = () => {return $http.get('/auth/session'); }

	this.setUsername = value => {  _data.username = value; };
	this.getUsername = () => { return _data.username; };

	this.setLoginStatus = value => {  _data.isLogged = value; };		
	this.getLoginStatus = () => { return  _data.isLogged; };

	this.setDataUser = value => {  _data.dataUser = value; };
	this.getDataUser = () => { return  _data.dataUser; };

	this.socialAuth = socialName => { return $http.get( configService.getValue('host') + '/auth/' + socialName); };
	
	this.login 	= user => { return $http.post( configService.getValue('host') + '/auth/login', user);};
	
	this.registr = newUser => {	return $http.post( configService.getValue('host') + '/auth/registr', newUser);};
	
	this.getAllUsersList = () => {	return $http.get( configService.getValue('host') + '/api/getAllUsersList');};
}]);
