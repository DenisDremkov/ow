'use strict';

myAppModule.service('configService', [ function() {

	let _config = {
		host: 'http://75c1741d.ngrok.io'    // adress where send http requests
	}

	this.getValue = path => { return _config[ path ]; }
	
}]);