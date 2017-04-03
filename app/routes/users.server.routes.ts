'use strict';

/**
 * Account router for REST endpoints
 */

'use strict';

import { Router, Request, Response, NextFunction } from 'express';

const passport = require('passport');
const users = require('../../app/controllers/users.server.controller');

export class UserRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
	// Setting up the users profile api
	this.router.route ('/users/me').get(users.me);
	this.router.route('/users').put(users.update);
	this.router.route('/users/users').delete(users.removeOAuthProvider);

	// Setting up the users password api
	this.router.route('/users/password').post(users.changePassword);
	this.router.route('/auth/forgot').post(users.forgot);
	this.router.route('/auth/reset/:token').get(users.validateResetToken);
	this.router.route('/auth/reset/:token').post(users.reset);

	// Setting up the users authentication api
	this.router.route('/auth/signup').post(users.signup);
	this.router.route('/auth/signin').post(users.signin);
	this.router.route('/auth/signout').get(users.signout);

	// Setting the google oauth routes
	this.router.route('/auth/google').get(passport.authenticate('google', {
		scope: [
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email'
		]
	}));

	this.router.route('/auth/google/callback').get(users.oauthCallback('google'));

	// Setting the yahoo oauth routes
	this.router.route('/auth/yahoo').get(passport.authenticate('yahoo'));
	this.router.route('/auth/yahoo/callback').get(users.oauthCallback('yahoo'));

	//todo - figure out how to unpack the req to pull the user out. Ideally I want to call stockpositions.listdaily and chain the route.
	this.router.route('/users/generateDailyStocksEmail').post(users.generateDailyStocksEmail);

	// Finish by binding the user middleware
	this.router.param('userId', users.userByID);
  }

}

//Create a new instance and expose it.
const userRoutes = new UserRouter();
user.init();
