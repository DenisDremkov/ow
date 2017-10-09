'use strict';

myAppModule.service('configService', [ function() {

	let _config = {
		host: 'http://632c646c.ngrok.io'    // adress where send http requests
	}

	this.getValue = path => { return _config[ path ]; }
	
}]);
