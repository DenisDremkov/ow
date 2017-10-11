'use strict';

myAppModule.controller('productsCtrl', ['$scope', '$window', 'productsService', 
function($scope, $window, productsService) {
	
	// init products array
	$scope.products = productsService.getProducts();

	$scope.buyPoduct = (product) => {
		productsService
			.payProduct(product)
			.success(function() {console.log('success')})
			.error(function() {console.log('error')})
	};
}])