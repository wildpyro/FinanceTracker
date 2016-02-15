'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var stockpositions = require('../../app/controllers/stockpositions.server.controller');

	// Stockpositions Routes
	app.route('/stockpositions')
		.get(stockpositions.list)
		.post(users.requiresLogin, stockpositions.create);

	app.route('/stockpositions/:accountType')
		.get(stockpositions.listByAccountType)
		.put(users.requiresLogin, stockpositions.hasAuthorization, stockpositions.update);

	app.route('/stockpositions/:stockpositionId')
		.get(stockpositions.read)
		.put(users.requiresLogin, stockpositions.hasAuthorization, stockpositions.update)
		.delete(users.requiresLogin, stockpositions.hasAuthorization, stockpositions.delete);

	// Finish by binding the Stockposition middleware
	app.param('stockpositionId', stockpositions.stockpositionByID);
	app.param('accountType', stockpositions.listByAccountType);
};