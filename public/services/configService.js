'use strict';

myAppModule.service('configService', [ function() {

	let _config = {
		host: 'http://0cdb06f7.ngrok.io'    // adress where send http requests
	}

	this.getValue = path => { return _config[ path ]; }
	
}]);
