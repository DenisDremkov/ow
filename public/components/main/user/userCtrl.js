'use strict';

myAppModule.controller('userCtrl', function($scope, dataService, userService) {
	$scope.userData =  userService.getDataUser();
	$scope.showData = () => {console.log($scope.userData); console.log(userService.getDataUser())}
})