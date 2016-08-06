'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var accounts = require('../../app/controllers/accounts.server.controller');

	// Accounts Routes
	app.route('/accounts')
		.get(accounts.list)
		.post(users.requiresLogin, accounts.create);

	app.route('/accountsFetch')
		.get(accounts.list);	

	app.route('/accounts/:accountId')
		.get(accounts.read)
		//.put(users.requiresLogin, accounts.hasAuthorization, accounts.update)
		.put(users.requiresLogin, accounts.update)
		.delete(users.requiresLogin, accounts.hasAuthorization, accounts.delete);

	// Finish by binding the Account middleware
	app.param('accountId', accounts.accountByID);
};
