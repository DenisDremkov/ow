
'use strict';

// APP
	const myAppModule = angular.module('ow', [
		'ngMaterial',
		'ngCookies'
	]);

// INTERCEPTOR
	myAppModule.factory('httpInterceptor', [ '$window', function($window) {
		var httpInterceptor = {
			request: request => {
				return request;
			}
		};
		return httpInterceptor;
	}]);


// CONFIG
	myAppModule.config(['$httpProvider', function($httpProvider) {
		$httpProvider.interceptors.push('httpInterceptor');
	}]);


// RUN
	myAppModule.run(['$rootScope', '$http', 'dataService', 'userService', '$cookies', function ($rootScope, $http, dataService, userService, $cookies) {
		
		return	userService.getSession()
				.success( data => { 
					if (data.success) {
						let obj = JSON.parse(data.user.ghStringData)
						console.log(data.user)
						console.log(obj)
						userService.setDataUser(obj);
						userService.setUsername(data.user.username);
						userService.setLoginStatus(true);
						dataService.setFavorites(data.user.favorite);
					}
					else {
						console.log(data.msg)
					}
				})
				.error( err => { console.log(err) });	

		
	}]);
