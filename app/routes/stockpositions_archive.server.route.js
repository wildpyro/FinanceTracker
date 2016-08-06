'use strict';

module.exports = function(app) {
	var stockpositions_archive = require('../../app/controllers/stockpositions_archive.server.controller');

	app.route('/stockpositions_archive/restoreFromBackup').post(stockpositions_archive.restoreStockPositionsFromArchive);

	// Finish by binding the stockpositions_archive middleware
	//app.param('stockpositions_archiveId', stockpositions_archive.stockpositiondetailByID);
};
