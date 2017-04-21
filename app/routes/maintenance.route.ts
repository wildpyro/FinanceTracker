import { Router, Request, Response, NextFunction } from 'express';

const user = require('../../app/controllers/users.server.controller');
const gainLoss = require('../../app/controllers/gainloss.server.controller');
const stockpositions_archive = require('../../app/controllers/stockpositions.server.controller');
const layout = require('../../app/controllers/stockpositions/layouts/base.server.layout');
const stockposition = require('../../app/controllers/stockpositions/sp.base.server.controller');

export class MaintenanceRouter {
	router: Router;

	constructor() {
		this.router = Router();
		this.init();
	}

	init() {

		//Routes to output data
		this.router.route('/stockpositions_export/exportData')
			.post(user.requiresLogin, stockpositions_archive.monthlyReporting);

		//Routes for backup and restore
		this.router.route('/maintenance/monthlyReporting')
			.post(user.requiresLogin, stockpositions_archive.monthlyReporting);

		this.router.route('/maintenance/restoreFromBackup')
			.post(user.requiresLogin, stockpositions_archive.restoreStockPositionsFromArchive);

		//Add in the layout selected from the drop down
		this.router.route('/maintenance/importStockPositions')
			.post(user.requiresLogin, layout.importFiles);

		//Bulk update prices
		this.router.route('/maintenance/updatePrices')
			.post(user.requiresLogin, stockposition.updatePrices);
	}

}

//Create a new instance and expose it.
const maintenanceRoutes = new MaintenanceRouter();
export default maintenanceRoutes.router;
