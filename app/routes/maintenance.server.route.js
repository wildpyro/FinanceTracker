'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var stockpositions_archive = require('../../app/controllers/stockpositions_archive.server.controller');

	//Routes to output data
	app.route('/stockpositions_export/exportData').post(users.requiresLogin, stockpositions_archive.monthlyReporting);
	
	//Routes for backup and restore 
	app.route('/maintenance/monthlyReporting').post(users.requiresLogin, stockpositions_archive.monthlyReporting);
	app.route('/maintenance/restoreFromBackup').post(users.requiresLogin, stockpositions_archive.restoreStockPositionsFromArchive);
};