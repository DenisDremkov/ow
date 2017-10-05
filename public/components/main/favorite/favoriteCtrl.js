'use strict';

myAppModule.controller('favoriteCtrl', function($scope, dataService, userService) {

	function getCityTemperature(city) {
		dataService
			.getCityTemperature(city)
			.then(
				data => {
					let obj = _.find($scope.favorites, function (obj) { return obj.name === city; });
					obj.temp = (JSON.parse(data)).temp;
					$scope.$root.$applyAsync();
				},
				err => console.log(err)
			)
	}

	$scope.favorites = dataService.getFavorites();
	$scope.isLogged = userService.getLoginStatus();

	if ($scope.favorites && $scope.favorites.length) {
		for (let i = 0; i < $scope.favorites.length; i++) {
			let city = $scope.favorites[i].name;
			getCityTemperature(city);
		}
	}

	$scope.getFavoriteCityData = city => {
		dataService
			.getData(city)		
		    .success( data => { 
		    	$scope.mainView = data.data; 
		    })
			.error( () =>  console.log('error'));
	}

	$scope.$watch('favorites.length', function(newV, oldV) {
		if (newV > oldV) {
			$scope.favorites.map(function(obj) {
				if (!obj.temp) {
					getCityTemperature(obj.name);
				}
			})
		}
	})
});