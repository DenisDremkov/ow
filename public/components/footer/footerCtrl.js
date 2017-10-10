'use strict';

myAppModule.controller('footerCtrl', function($scope, userService, dataService, $window) {

	$scope.allUsersList = null;
	
	$scope.getAllUsersList = () => {
		userService
			.getAllUsersList()
			.success( data =>  { $scope.allUsersList = data; } )
			.error( err =>  console.log(err) );
	};
})