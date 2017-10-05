'use strict';

myAppModule.controller('dataCtrl', function($scope, dataService, userService) {
	
	$scope.city = 'london';
	
	$scope.isLogged = () => { return userService.getLoginStatus(); }

	$scope.disableAddBtn = () => {
		let favorites = dataService.getFavorites();
		let isRepeated = false;
		favorites.map(function(obj) {
			if (obj.name === $scope.city) {
				isRepeated = true
			}
		});
		return isRepeated || !$scope.city || $scope.city === '';
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
				dataService.getFavorites().push({name: $scope.city}); 
				$scope.city = undefined;
			})
			.error(() => {console.log('error')});
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