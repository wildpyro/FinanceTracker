'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
	// User Routes
	var users = require('../../app/controllers/users.server.controller'),
		stockpositions = require('../../app/controllers/stockpositions.server.controller');

	// Setting up the users profile api
	app.route('/users/me').get(users.me);
	app.route('/users').put(users.update);
	app.route('/users/accounts').delete(users.removeOAuthProvider);

	// Setting up the users password api
	app.route('/users/password').post(users.changePassword);
	app.route('/auth/forgot').post(users.forgot);
	app.route('/auth/reset/:token').get(users.validateResetToken);
	app.route('/auth/reset/:token').post(users.reset);

	// Setting up the users authentication api
	app.route('/auth/signup').post(users.signup);
	app.route('/auth/signin').post(users.signin);
	app.route('/auth/signout').get(users.signout);

	// Setting the google oauth routes
	app.route('/auth/google').get(passport.authenticate('google', {
		scope: [
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email'
		]
	}));
	app.route('/auth/google/callback').get(users.oauthCallback('google'));

	// Setting the yahoo oauth routes
	app.route('/auth/yahoo').get(passport.authenticate('yahoo'));
	app.route('/auth/yahoo/callback').get(users.oauthCallback('yahoo'));

	//todo - figure out how to unpack the req to pull the user out. Ideally I want to call stockpositions.listdaily and chain the route. 
	app.route('/users/generateDailyStocksEmail').post(users.generateDailyStocksEmail);

	// Finish by binding the user middleware
	app.param('userId', users.userByID);
};