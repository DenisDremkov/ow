
'use strict';

// app
	const myAppModule = angular.module('ow', []);

// interceptor
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


// config
	myAppModule.config(['$httpProvider', function($httpProvider) {
		$httpProvider.interceptors.push('sessionInjector');
	}]);


// run
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



// SERVICE
	
	// data service
	myAppModule.service('dataService', function($http) {

		let _favorites = null;
		
		this.setFavorites = data => { _favorites = data; };
		this.getFavorites = data => { return _favorites; };

		this.getData = function(city) {
			return $http.get( 'http://localhost:3000/getData', {params: {city: city}});	
		};

		this.addToFavorite= function(city, username) {
			return $http.post( 'http://localhost:3000/addToFavorite', {city: city, username: username});
		};

		this.deleteFavoriteCity = function(city, username) {
			return $http.post( 'http://localhost:3000/deleteFavoriteCity', {city: city, username: username});
		};
	});

	// auth service
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


// CONTROLLERS
	
	// auth ctrl		
	myAppModule.controller('authCtrl', function($scope, userService, $window) {
		
		$scope.view = {}
		
		$scope.toggleLoginForm = () => { $scope.view.login = !$scope.view.login; };

		$scope.getUserName = () => {return userService.getUsername();}
		$scope.isLogged = () => { return userService.getLoginStatus(); }
		
		$scope.signOut = () => {
			$window.localStorage.removeItem('sessionOw');
			location.reload(); 
		};

		$scope.getAllUsersList = function() {
			userService
				.getAllUsersList()
				.success( data => { $scope.allUsersList = data; })
				.error( err => { console.log(err) });
		};
	})

	// registr ctrl		
	myAppModule.controller('registrCtrl', function($scope, userService, dataService, $window) {

		$scope.newUser = {}
		$scope.errMsg = {};

		function hideRegistrForm() {
			$scope.view.registr = false;
			$scope.view.login = true;
		}

		$scope.hideRegistrForm = () => { hideRegistrForm();	};

		$scope.registr = function() {
			// validation
			if (!$scope.newUser.username || !$scope.newUser.password || !$scope.newUser.confirm) {
				$scope.errMsg.registrErrMsg = 'fill all fields';
				$scope.errMsg.class = 'error'
				return;
			}
			if ($scope.newUser.password !== $scope.newUser.confirm) {
				$scope.errMsg.registrErrMsg = 'confirm not equal to password';
				$scope.errMsg.class = 'error'
				return;
			}
			$scope.errMsg.registrErrMsg = 'all fields valid';
			$scope.errMsg.class = 'success';
			
			// registr
			userService
				.registr({
					username: $scope.newUser.username, 
					password: $scope.newUser.password
				})
				.success( data => hideRegistrForm() )
				.error( err => console.log(err) );
		};
	})

	// login ctrl		
	myAppModule.controller('loginCtrl', function($scope, userService, dataService, $window) {

		$scope.user = {};
		$scope.errMsg = {};

		$scope.hideLoginForm = () => { $scope.view.login = false; };

		$scope.openRegistrForm = () => {
			$scope.view.registr = true;
			$scope.view.login = false;
		};

		$scope.hideRegistrForm = () => hideRegistrForm();

		$scope.login = () => {
			
			userService
				.login($scope.user)
				.success( data => { 
					if (data.success) {
						userService.setLoginStatus(true);
						userService.setUsername($scope.user.username);
						dataService.setFavorites(data.favorite);
						$scope.view.login = false;
						$window.localStorage.setItem('sessionOw', data.token)
					}
					else {
						$scope.errMsg.registrErrMsg = data.msg;
						$scope.errMsg.class = 'error'
					}
				})
				.error( err => console.log(err) );
		}

		$scope.registr = () => {
			// client validation
			if (!$scope.newUser.username || !$scope.newUser.password || !$scope.newUser.confirm) {
				$scope.errMsg.registrErrMsg = 'fill all fields';
				$scope.errMsg.class = 'error'
				return;
			}
			if ($scope.newUser.password !== $scope.newUser.confirm) {
				$scope.errMsg.registrErrMsg = 'confirm not equal to password';
				$scope.errMsg.class = 'error'
				return;
			}
			$scope.errMsg.registrErrMsg = 'all fields valid';
			$scope.errMsg.class = 'success';
			
			// registration
			userService
				.registr({username: $scope.newUser.username, password: $scope.newUser.password})
				.success( data =>  hideRegistrForm() )
				.error( err =>  console.log(err) );
		};

		$scope.signOut = () => {
			$window.localStorage.removeItem('sessionOw');
			location.reload(); 
		};

		$scope.getAllUsersList = () => {
			userService
				.getAllUsersList()
				.success( data =>  { $scope.allUsersList = data; } )
				.error( err =>  console.log(err) );
		};
	})

	//  data ctrl
	myAppModule.controller('dataCtrl', function($scope, dataService, userService) {
		
		$scope.city = 'london';
		
		$scope.isLogged = () => { return userService.getLoginStatus(); }

		$scope.disableAddBtn = () => {
			let favorites = dataService.getFavorites();
			if (favorites) {
				return (favorites.indexOf($scope.city) !== -1) || !$scope.city || ($scope.city === ''); 
			} else {
				return false;
			}
		}

		$scope.disableGetBtn = () => { return !$scope.city || ($scope.city === ''); }

		$scope.getCityData = city => {
			dataService
				.getData(city)		
			    .success( data => { $scope.mainView = data.data; })
				.error( () => console.log('error') );
		}

		$scope.addToFavorite = () => {
			dataService
				.addToFavorite($scope.city, userService.getUsername())	
				.success( data => { 
					dataService.getFavorites().push($scope.city); 
					$scope.city = undefined;
				})
				.error(() => {console.log('error')});
		}

		$scope.deleteFavoriteCity = function(city) {
			dataService
				.deleteFavoriteCity(city, userService.getUsername())		
			    .success( data => { 
			    	let favorites = dataService.getFavorites();
					favorites.splice(favorites.indexOf(city), 1); 
				})
				.error(() => console.log('error'));
		}


		$scope.detectDataType = (value) => { 
			if (typeof value === 'string' || typeof value === 'number') {
				return 'simple';
			} else {
				if (Array.isArray(value)) { return 'array'; } 
				else { return 'object'; }
			}			 
		}
	})

	// favorite ctrl
	myAppModule.controller('favoriteCtrl', function($scope, dataService) {
		
		$scope.favorites = dataService.getFavorites();
		
		$scope.getFavoriteCityData = city => {
			dataService
				.getData(city)		
			    .success( data => { $scope.mainView = data.data; })
				.error( () =>  console.log('error'));
		}
	});
