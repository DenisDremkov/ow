
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
	myAppModule.config(['$httpProvider', '$stateProvider', '$urlRouterProvider', '$locationProvider', 
		// '$window', 'configService',
		function( $httpProvider, $stateProvider, $urlRouterProvider, $locationProvider) {
		$httpProvider.interceptors.push('httpInterceptor');
		// $window, configService,
		// $locationProvider.html5Mode(true).hashPrefix('!')				!!! add in new projects
		$urlRouterProvider.otherwise('/');
		// $window.stripe = Stripe(configService.getValue('stripePublish'));
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
			})
			.state('products', {
				url: "/products",
				controller: 'productsCtrl',
				templateUrl: "components/products/products.html"
			});
	}]);


// RUN
	myAppModule.run([ '$window', '$rootScope', '$http', 'configService', 'dataService', 'userService', '$cookies', 
	function (  $window, $rootScope, $http, configService, dataService, userService, $cookies) {


		
		// wait session results
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
