
// app
	const myAppModule = angular.module('ow', [
		'ngCookies'
	]);

// run
	myAppModule.run(['$rootScope', '$http', 'dataService', function ($rootScope, $http, dataService) {
		return $http
			.get('http://localhost:3000/session')
			.success(function(data) {
				if (data.username) {
					$rootScope.isLogged = true;
					$rootScope.username =  data.username;
					dataService.setFavorites(data.favorite);
				}				
			})
			.error(function() {console.log('error')});

	}]);

// CONTROLLERS
	
	// auth ctrl		
	myAppModule.controller('authCtrl', function($scope, authService, dataService, $cookies) {

		$scope.user = {};
		$scope.newUser = {};
		$scope.errMsg = {};

		function clearData() {
			$scope.user = {};
			$scope.newUser = {};
			$scope.errMsg = {};
		}
		
		function hideRegistrForm() {
			$scope.registrView = false;
			$scope.loginView = true;
			clearData();
		};

		$scope.toggleLoginForm = function() { $scope.loginView = !$scope.loginView; };

		$scope.hideLoginForm = function() { $scope.loginView = false; };

		$scope.openRegistrForm = function() {
			$scope.registrView = true;
			$scope.loginView = false;
			clearData();
		};

		$scope.hideRegistrForm = function() {
			hideRegistrForm();
		};

		$scope.login = function() {
			
			authService
				.login($scope.user)
				.success(function(data) { 
					if (data.success) {
						$scope.$root.isLogged = true;
						$scope.loginView = false;
						$scope.$root.username = $scope.user.username;
						dataService.setFavorites(data.favorite);
					}
					else {
						$scope.errMsg.registrErrMsg = data.msg;
						$scope.errMsg.class = 'error'
					}
				})
				.error(function(err) { console.log(err) });
		}

		$scope.registr = function() {
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
			authService
				.registr({username: $scope.newUser.username, password: $scope.newUser.password})
				.success(function(data) { hideRegistrForm(); })
				.error(function(err) { console.log(err) });
		};

		$scope.signOut = function() {
			$cookies.remove('sessionOw');
			location.reload(); 
		};

		$scope.getAllUsersList = function() {
			authService
				.getAllUsersList()
				.success(function(data) { $scope.allUsersList = data; })
				.error(function(err) { console.log(err) });
		};
	})

	//  data ctrl
	myAppModule.controller('dataCtrl', function($scope, dataService) {
		
		$scope.city = 'london';
		
		$scope.disableAddBtn = function() {
			let favorites = dataService.getFavorites();
			if (favorites) {
				return (favorites.indexOf($scope.city) !== -1) || !$scope.city || ($scope.city === ''); 
			} else {
				return false;
			}
		}

		$scope.disableGetBtn = function() { return !$scope.city || ($scope.city === ''); }

		$scope.getCityData = function(city) {
			dataService
				.getData(city)		
			    .success(function(data) { $scope.mainView = data.data;})
				.error(function() {console.log('error')});
		}

		$scope.addToFavorite = function() {
			dataService
				.addToFavorite($scope.city, $scope.$root.username)	
				.success(function(data) { 
					dataService.getFavorites().push($scope.city); 
					$scope.city = undefined;
				})
				.error(function() {console.log('error')});
		}

		$scope.deleteFavoriteCity = function(city) {
			dataService
				.deleteFavoriteCity(city,  $scope.$root.username)		
			    .success(function(data) { 
			    	let arr = dataService.getFavorites();
					arr.splice(arr.indexOf(city), 1); 
				})
				.error(function() {console.log('error')});
		}


		$scope.detectDataType = function(value) { 
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
		$scope.getFavoriteCityData = function(city) {
			dataService
				.getData(city)		
			    .success( data => { $scope.mainView = data.data; })
				.error(function() {console.log('error')});
		}
	});

// SERVICE
	
	// data service
	myAppModule.service('dataService', function($http) {

		let favorites = null;
		
		this.setFavorites = function(data) {
			favorites = data;
		}

		this.getFavorites = function(data) {
			return favorites;
		}

		this.getData= function(city) {
			return $http({
				url: 'http://localhost:3000/getData', 
				method: "GET",
				params: {city: city}
			})	
		},

		this.addToFavorite= function(city, username) {
			return $http.post(
				'http://localhost:3000/addToFavorite',
				{city: city, username: username}
			)
		}

		this.deleteFavoriteCity = function(city, username) {
			return $http.post(
				'http://localhost:3000/deleteFavoriteCity',
				{city: city, username: username}
			)
		}
	});

	// auth service
	myAppModule.service('authService', function($http, $q) {
		this.login= function(user) {
			return $http.post('http://localhost:3000/login', user);
		};

		this.registr= function(newUser) {
			return $http.post('http://localhost:3000/registr', newUser);
		};

		this.getAllUsersList= function() {
			return $http.get('http://localhost:3000/getAllUsersList');
		};
	});