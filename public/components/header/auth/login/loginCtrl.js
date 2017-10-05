'use strict';

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
