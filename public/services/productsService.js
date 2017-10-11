'use strict';


myAppModule.service('productsService', [ '$window', 'configService', '$http',
function($window, configService, $http) {
	
	let _products = [];
	
	// get http
	let productsHtttp = [
		{name: 'prod-1',price: 100,	amount: 0},
		{name: 'prod-2',price: 55,	amount: 0},
		{name: 'prod-3',price: 77,	amount: 0}
	]

	class Product {
		constructor(name, price) {
			this.name = name;
			this.price = price;
			this.summ = 0;
			this.amount = 0;
		}
		setSumm(amount) {
			this.amount = amount;
			this.summ = this.price * amount;
		}
	}

	productsHtttp.map( (prod) => {
		_products.push(new Product(prod.name, prod.price));
	})

	this.getProducts = () => { return _products; }

	this.payProduct = (product) => {
		return $http.post(configService.getValue('host') + '/pay/stripeForm',  product);
	}

}]);
