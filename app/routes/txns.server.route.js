'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var txns = require('../../app/controllers/txns.server.controller');

	// Stockpositions Routes
	app.route('/txns')
		.get(txns.list)
		.post(users.requiresLogin, txns.create);

	app.route('/txns/:txnId')
		.get(txns.read)
		.put(users.requiresLogin, txns.hasAuthorization, txns.update)
		.delete(users.requiresLogin, txns.hasAuthorization, txns.delete);

	// Finish by binding the Stockposition middleware
	app.param('txnId', txns.txnByID);
};
