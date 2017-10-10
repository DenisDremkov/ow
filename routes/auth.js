
module.exports = (router) => {

	// session
	router.get('/session', require('./auth/session'));
	
	// local
	router.post('/registr', require('./auth/localRegistr'));
	router.post('/login', require('./auth/localLogin'));

	// github auth
	router.get('/github', require('./auth/github').getGitHubLoginForm);
	router.get('/github/cb', require('./auth/github').getUserInfo);

	// google auth

	return router;
}