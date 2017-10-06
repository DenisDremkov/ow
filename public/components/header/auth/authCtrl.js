'use strict';
	
myAppModule.controller('authCtrl', function($scope, userService, $window) {
	
	$scope.view = {}
	
	$scope.toggleLoginForm = () => { $scope.view.login = !$scope.view.login; };

	$scope.getUserName = () => {return userService.getUsername();}
	$scope.isLogged = () => { return userService.getLoginStatus(); }
	
	$scope.signOut = () => {
		location.reload(); 
	};

	$scope.getAllUsersList = function() {
		userService
			.getAllUsersList()
			.success( data => { $scope.allUsersList = data; })
			.error( err => { console.log(err) });
	};
})