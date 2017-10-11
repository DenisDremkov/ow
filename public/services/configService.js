'use strict';

myAppModule.service('configService', [ function() {

	let _config = {
		host: 'https://456d9104.ngrok.io'    // adress where send http requests
	}

	this.getValue = path => { return _config[ path ]; }
	
}]);
