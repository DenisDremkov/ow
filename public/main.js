
'use strict';

// APP
	const myAppModule = angular.module('ow', [
		'ui.router',
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
	myAppModule.config(['$httpProvider', '$stateProvider', '$urlRouterProvider', function($httpProvider, $stateProvider, $urlRouterProvider) {
		$httpProvider.interceptors.push('httpInterceptor');

		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('data', {
				url: "/",
				controller: 'dataCtrl',
				templateUrl: "components/main/data.html"
			})
			.state('maps', {
				url: "/maps",
				controller: 'mapsCtrl',
				templateUrl: "components/maps/maps.html"
			});
	}]);


// RUN
	myAppModule.run(['$rootScope', '$http', 'dataService', 'userService', '$cookies', function ($rootScope, $http, dataService, userService, $cookies) {
		
		return	userService.getSession()
				.success( data => { 
					if (data.success) {
						let obj = JSON.parse(data.user.oauthDataString)
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
