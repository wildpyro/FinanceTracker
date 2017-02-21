'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var gainLoss = require('../../app/controllers/gainloss.server.controller');

	// Stockpositions Routes
	app.route('/gainLosses')
		.get(gainLoss.list)
		.post(users.requiresLogin, gainLoss.create);
		//.delete(users.requiresLogin, txns.hasAuthorization, txns.delete); The code is coming from here, not the correct URL?

	app.route('/gainLosses/:txnId')
		.get(gainLoss.read)
		.put(users.requiresLogin, gainLoss.hasAuthorization, gainLoss.update)
		.delete(users.requiresLogin, gainLoss.hasAuthorization, gainLoss.delete);

	// Finish by binding the Stockposition middleware
	app.param('gainLossId', gainLoss.gainLossByID);
};
