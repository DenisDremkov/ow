'use strict';

myAppModule.service('configService', [ function() {

	let _config = {
		host: 'http://d8873a15.ngrok.io'    // adress where send http requests
	}

	this.getValue = path => { return _config[ path ]; }
	
}]);
