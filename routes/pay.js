
const 
	getConfig 	= require('./../configApp'),
	publish 	= getConfig('paySystem--stripe--secret'),
	stripe		= require('stripe')(getConfig('paySystem--stripe--secret')),
	pug 		= require('pug');

module.exports = (router) => {

	// stripe
	router.post('/stripeForm', function(req, res) {
		// console.log('!!!!!!!!!!!!!!!!!', req.body)
		let html = pug.renderFile('./views/stripe.pug', {'publish': publish, 'doctype': 'html' });
		console.log(html)
		// res.redirect(html);
		res.send(html)
	});
	
	return router;
}

// const 
// 	getConfig 	= require('./../configApp'),
// 	publish 	= getConfig('paySystem--stripe--secret'),
// 	stripe		= require('stripe')(getConfig('paySystem--stripe--secret')),
// 	pug 		= require('pug');
// 	const html 		= pug.renderFile('./views/stripe.pug', {publish});
// 	// console.log(__dirname + './views/stripe.pug')

// module.exports = (router) => {

// 	// stripe
// 	router.post('/stripeForm', function(req, res) {
// 		console.log('sdfgsdfgsdfg',req.body)
// 		res.render(html);
// 	});
	
// 	return router;
// }