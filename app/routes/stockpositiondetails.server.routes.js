'use strict';

module.exports = function(app) {
	var stockpositiondetails = require('../../app/controllers/stockpositiondetails.server.controller');

	app.route('/stockpositiondetails').get(stockpositiondetails.list);		

	// Finish by binding the Stockpositiondetail middleware
	app.param('stockpositiondetailId', stockpositiondetails.stockpositiondetailByID);
};
