
'use strict';

// APP
	const myAppModule = angular.module('ow', []);

// INTERCEPTOR
	myAppModule.factory('sessionInjector', [ '$window', function($window) {
		var sessionInjector = {
			request: request => {
				let token = $window.localStorage.getItem('sessionOw');
				request.headers['sessionToken'] = $window.localStorage.getItem('sessionOw');
				return request;
			}
		};
		return sessionInjector;
	}]);


// CONFIG
	myAppModule.config(['$httpProvider', function($httpProvider) {
		$httpProvider.interceptors.push('sessionInjector');
	}]);


// RUN
	myAppModule.run(['$rootScope', '$http', 'dataService', 'userService', '$window', function ($rootScope, $http, dataService, userService, $window) {
		let token = $window.localStorage.getItem('sessionOw');
		if (token) {
			return $http
				.get('http://localhost:3000/session')
				.success(function(data) {
					if (data.username) {
						userService.setLoginStatus(true);
						userService.setUsername(data.username);
						dataService.setFavorites(data.favorite);
					}				
				})
				.error(() => {console.log('error')});
		}
	}]);
