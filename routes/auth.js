
module.exports = (router) => {

	// session
	router.get('/session', require('./auth/session'));
	
	// local
	router.post('/registr', require('./auth/localRegistr'));
	router.post('/login', require('./auth/localLogin'));

	// github auth
	router.get('/github', require('./auth/github').getLoginForm);
	router.get('/github/cb', require('./auth/github').getDataUser);

	// google auth
	router.get('/google', require('./auth/google').getLoginForm);
	router.get('/google/cb', require('./auth/google').getUserInfo);

	return router;
}