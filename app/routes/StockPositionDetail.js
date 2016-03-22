'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var StockPositionDetail = require('../../app/controllers/StockPositionDetail.server.controller');

	app.route('/StockPositionDetail/:StockPositionDetailBySPID')
		.get(StockPositionDetail.read);

	// Finish by binding the Stockposition middleware
	app.param('StockPositionDetailBySPID', StockPositionDetail.StockPositionDetailBySPId);
};