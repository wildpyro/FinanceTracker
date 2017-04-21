import { Router, Request, Response, NextFunction } from 'express';

const user = require('../../app/controllers/users.server.controller');
const income = require('../../app/controllers/income.server.controller');

export class IncomeRouter {
	router: Router;

	constructor() {
		this.router = Router();
		this.init();
	}

	init() {
		this.router.route('/income')
			.get(income.listByDescription)
			.post(user.requiresLogin, income.create);

		this.router.route('/income/:txnId')
			.get(income.read)
			.put(user.requiresLogin, income.hasAuthorization, income.update)
			.delete(user.requiresLogin, income.hasAuthorization, income.delete);

		this.router.param('incomeId', income.incomeByID);
	}
}

//Create a new instance and expose it.
const incomeRoutes = new IncomeRouter();

export default incomeRoutes.router;
