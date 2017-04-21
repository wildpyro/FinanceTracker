import { Router, Request, Response, NextFunction } from 'express';

const users = require('../../app/controllers/users.server.controller');
const gainLoss = require('../../app/controllers/gainloss.server.controller');

export class GainLossRouter {
	router: Router;

	constructor() {
		this.router = Router();
		this.init();
	}

	init() {
		this.router.route('/gainLosses')
			.get(gainLoss.list)
			.post(users.requiresLogin, gainLoss.create);

		this.router.route('/gainLosses/:txnId')
			.get(gainLoss.read)
			.put(users.requiresLogin, gainLoss.hasAuthorization, gainLoss.update)
			.delete(users.requiresLogin, gainLoss.hasAuthorization, gainLoss.delete);

		this.router.param('gainLossId', gainLoss.gainLossByID);
	}

}

//Create a new instance and expose it.
const gainLossRoutes = new GainLossRouter();

export default gainLossRoutes.router;
