'use strict';

// TODO replace hostname to common config or backend
myAppModule.service('userService', [ '$http', 'configService', function($http, configService) {
		
	let _username = undefined;
	let _isLogged = undefined;

	this.setUsername = value => { _username = value; };
	this.getUsername = () => { return _username; };

	this.setLoginStatus = value => { _isLogged = value; };		
	this.getLoginStatus = () => { return _isLogged; };

	this.socialAuth = socialName => { return $http.get( configService.getValue('host') + '/auth/' + socialName); };
	
	this.login 	= user => { return $http.post( configService.getValue('host') + '/auth/login', user);};
	
	this.registr = newUser => {	return $http.post( configService.getValue('host') + '/auth/registr', newUser);};
	
	this.getAllUsersList = () => {	return $http.get( configService.getValue('host') + '/api/getAllUsersList');};
}]);
