'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var stockpositions = require('../../app/controllers/stockpositions.server.controller');

	// Stockpositions Routes
	app.route('/stockpositions')
		.get(users.requiresLogin, stockpositions.listBase)
		.post(users.requiresLogin, stockpositions.checkDuplicates, stockpositions.create);

	app.route('/stockpositions/:stockpositionId')
		.get(stockpositions.readBase)
		.put(users.requiresLogin, stockpositions.update, stockpositions.updatePrice)
		.delete(users.requiresLogin, stockpositions.deleteBase);
		
	// Finish by binding the Stockposition middleware
	app.param('stockpositionId', stockpositions.stockpositionByID);

};
