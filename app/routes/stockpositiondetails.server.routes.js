'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var stockpositiondetails = require('../../app/controllers/stockpositiondetails.server.controller');

	// Stockpositiondetails Routes
	app.route('/stockpositiondetails')
		.get(stockpositiondetails.list)
		.post(users.requiresLogin, stockpositiondetails.create);

	app.route('/stockpositiondetails/:stockpositiondetailId')
		.get(stockpositiondetails.read)
		.put(users.requiresLogin, stockpositiondetails.hasAuthorization, stockpositiondetails.update)
		.delete(users.requiresLogin, stockpositiondetails.hasAuthorization, stockpositiondetails.delete);

	// Finish by binding the Stockpositiondetail middleware
	app.param('stockpositiondetailId', stockpositiondetails.stockpositiondetailByID);
};
