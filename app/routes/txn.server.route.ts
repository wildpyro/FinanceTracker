import { Router, Request, Response, NextFunction } from 'express';

const user = require('../../app/controllers/users.server.controller');
const txn = require('../../app/controllers/txns.server.controller');

export class TxnRouter {
	router: Router;

	constructor() {
		this.router = Router();
		this.init();
	}

	init() {

		this.router.route('/txns')
			.get(txn.list)
			.post(user.requiresLogin, txn.create);

		this.router.route('/txns/:txnId')
			.get(txn.read)
			.put(user.requiresLogin, txn.hasAuthorization, txn.update)
			.delete(user.requiresLogin, txn.hasAuthorization, txn.delete);

		this.router.param('txnId', txn.txnByID);
	}
}

//Create a new instance and expose it.
const txnRoutes = new TxnRouter();
export default txnRoutes.router;
