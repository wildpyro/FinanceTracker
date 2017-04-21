import { Router, Request, Response, NextFunction } from 'express';

const users = require('../../app/controllers/users.server.controller');
const networth = require('../../app/controllers/networths.server.controller');
const stockPositions_Archive = require('../../app/controllers/stockpositions.server.controller');

export class NetworkRouter {
	router: Router;

	constructor() {
		this.router = Router();
		this.init();
	}

	init() {
		// Networth Routes
		this.router.route('/networth')
			.get(users.requiresLogin, networth.list)
			.post(users.requiresLogin, networth.create);

		this.router.route('/networth/:networthId')
			.get(networth.read)
			.put(users.requiresLogin, networth.hasAuthorization, networth.update)
			.delete(users.requiresLogin, networth.hasAuthorization, networth.delete);

		//Monthly stock listing Routes
		this.router.route('/monthlyListing').get(users.requiresLogin, stockPositions_Archive.listArchive);

		// Finish by binding the Networth middleware
		this.router.param('networthId', networth.networthByID);
	}
}

//Create a new instance and expose it.
const networkRoutes = new NetworkRouter();

export default networkRoutes.router;
