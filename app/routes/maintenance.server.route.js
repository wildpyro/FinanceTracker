'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller'),
		stockpositions_archive = require('../../app/controllers/stockpositions.server.controller'),
		layout = require('../../app/controllers/stockpositions/layouts/base.server.layout');

	//Routes to output data
	app.route('/stockpositions_export/exportData').post(users.requiresLogin, stockpositions_archive.monthlyReporting);
	
	//Routes for backup and restore 
	app.route('/maintenance/monthlyReporting').post(users.requiresLogin, stockpositions_archive.monthlyReporting);
	app.route('/maintenance/restoreFromBackup').post(users.requiresLogin, stockpositions_archive.restoreStockPositionsFromArchive);

	//Add in the layout selected from the drop down 
	app.route('/maintenance/importStockPositions').post(users.requiresLogin, layout.importStockPosition);
};