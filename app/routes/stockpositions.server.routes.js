'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var stockpositions = require('../../app/controllers/stockpositions.server.controller');

	// Stockpositions Routes
	app.route('/stockpositions')
		.get(stockpositions.list)
		.post(users.requiresLogin, stockpositions.create);

	app.route('/stockpositions/:stockpositionId')
		.get(stockpositions.read)
		.put(users.requiresLogin, stockpositions.update)
		.delete(users.requiresLogin, stockpositions.delete);
		//.put(users.requiresLogin, stockpositions.hasAuthorization, stockpositions.update)
		//.delete(users.requiresLogin, stockpositions.hasAuthorization, stockpositions.delete);

	// Finish by binding the Stockposition middleware
	app.param('stockpositionId', stockpositions.stockpositionByID);

};
