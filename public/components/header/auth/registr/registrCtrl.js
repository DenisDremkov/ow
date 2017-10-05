'use strict';

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