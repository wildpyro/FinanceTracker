'use strict';

module.exports = function(app) {
	var stockpositions_archive = require('../../app/controllers/stockpositions_archive.server.controller');

	app.route('/stockpositions_archive/restoreFromBackup').post(stockpositions_archive.restoreStockPositionsFromArchive);
};
