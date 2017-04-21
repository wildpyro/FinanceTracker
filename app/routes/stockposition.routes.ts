import { Router, Request, Response, NextFunction } from 'express';

const users = require('../../app/controllers/users.server.controller');
const stockposition = require('../../app/controllers/stockpositions/sp.base.server.controller');

export class StockpositionRouter {
	router: Router;

	constructor() {
		this.router = Router();
		this.init();
	}

	init() {

		app.route('/stockpositions')
			.get(users.requiresLogin, stockposition.listBase)
			.post(users.requiresLogin, stockposition.checkDuplicates, stockposition.create);

		app.route('/stockpositions/:stockpositionId')
			.get(stockposition.readBase)
			.put(users.requiresLogin, stockposition.update, stockposition.updatePrice)
			.delete(users.requiresLogin, stockposition.deleteBase);

		// Finish by binding the Stockposition middleware
		app.param('stockpositionId', stockposition.stockpositionByID);
	}
}

//Create a new instance and expose it.
const stockpositionRoutes = new StockpositionRouter();
export default stockpositionRoutes.router;
