import { Router, Request, Response, NextFunction } from 'express';

const stockpositiondetail = require('../../app/controllers/stockpositions/sp.details.server.controller');

export class StockpositionDetailRouter {
	router: Router;

	constructor() {
		this.router = Router();
		this.init();
	}

	init() {

		this.router.route('/stockpositiondetails').get(stockpositiondetail.listQuoteDetails);

		// Finish by binding the Stockpositiondetail middleware
		this.router.param('stockpositiondetailId', stockpositiondetail.stockpositiondetailByID);
	}
}

//Create a new instance and expose it.
const stockpositiondetailRoutes = new StockpositionDetailRouter();
export default stockpositiondetailRoutes.router;
