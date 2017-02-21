'use strict';

module.exports = function(app) {
	var stockpositiondetails = require('../../app/controllers/stockpositions/sp.details.server.controller');

	app.route('/stockpositiondetails').get(stockpositiondetails.listQuoteDetails);		

	// Finish by binding the Stockpositiondetail middleware
	app.param('stockpositiondetailId', stockpositiondetails.stockpositiondetailByID);
};
