
'use strict';

// APP
	const myAppModule = angular.module('ow', []);

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
	myAppModule.run(['$rootScope', '$http', 'dataService', 'userService', '$window', function ($rootScope, $http, dataService, userService, $window) {
		
	}]);
