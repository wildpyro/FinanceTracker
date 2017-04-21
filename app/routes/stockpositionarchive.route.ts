import { Router, Request, Response, NextFunction } from 'express';

const stockPositionArchive = require('../../app/controllers/stockpositions.server.controller');

export class StockpositionArchiveRouter {
	router: Router;

	constructor() {
		this.router = Router();
		this.init();
	}

	init() {
		this.router.route('/stockpositions_archive/restoreFromBackup').post(stockPositionArchive.restoreStockPositionsFromArchive);
	}
}

//Create a new instance and expose it.
const stockpositionArchiveRoutes = new StockpositionArchiveRouter();
export default stockpositionArchiveRoutes.router;
