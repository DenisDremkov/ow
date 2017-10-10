'use strict';

myAppModule.service('configService', [ function() {

	let _config = {
<<<<<<< HEAD
		host: 'https://0cdb06f7.ngrok.io'    // adress where send http requests
=======
		host: 'http://d8873a15.ngrok.io'    // adress where send http requests
>>>>>>> 216c7071fa561d8e97cf4963c3f46cab82db48dc
	}

	this.getValue = path => { return _config[ path ]; }
	
}]);
