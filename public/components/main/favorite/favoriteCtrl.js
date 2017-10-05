'use strict';

myAppModule.controller('favoriteCtrl', function($scope, dataService, userService) {

	$scope.favorites = dataService.getFavorites();
	$scope.isLogged = userService.getLoginStatus();

	dataService
		.getAllTemperature($scope.favorites)
		.then( result => {
			$scope.favorites.map( city => { city.temp = result[city.name].data.temp; })
			$scope.$root.$applyAsync();
		});

	$scope.getFavoriteCityData = city => {
		dataService
			.getData(city)		
		    .success( data => { $scope.mainView = data.data; })
			.error( () =>  console.log('error'));
	}

	$scope.$watch('favorites.length', function(newV, oldV) {
		if (newV > oldV) {
			$scope.favorites.map( city => {
				if (!city.temp) {
					dataService.getCityTemperature(city.name)
						.then( result => {city.temp = result.data.temp;	});
				}
			})
		}
	})
});