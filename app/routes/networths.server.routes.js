'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var networths = require('../../app/controllers/networths.server.controller');

	// Networths Routes
	app.route('/networths')
		.get(networths.list)
		.post(users.requiresLogin, networths.create);

	app.route('/networths/:networthId')
		.get(networths.read)
		.put(users.requiresLogin, networths.hasAuthorization, networths.update)
		.delete(users.requiresLogin, networths.hasAuthorization, networths.delete);

	// Finish by binding the Networth middleware
	app.param('networthId', networths.networthByID);
};
