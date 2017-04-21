'use strict';

/**
 * Account router for REST endpoints
 */

'use strict';

import { Router, Request, Response, NextFunction } from 'express';

const passport = require('passport');
const user = require('../../app/controllers/users.server.controller');

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
		// Setting up the user profile api
		this.router.route('/user/me').get(user.me);
		this.router.route('/user').put(user.update);
		this.router.route('/user/user').delete(user.removeOAuthProvider);

		// Setting up the user password api
		this.router.route('/user/password').post(user.changePassword);
		this.router.route('/auth/forgot').post(user.forgot);
		this.router.route('/auth/reset/:token').get(user.validateResetToken);
		this.router.route('/auth/reset/:token').post(user.reset);

		// Setting up the user authentication api
		this.router.route('/auth/signup').post(user.signup);
		this.router.route('/auth/signin').post(user.signin);
		this.router.route('/auth/signout').get(user.signout);

		// Setting the google oauth routes
		this.router.route('/auth/google').get(passport.authenticate('google', {
			scope: [
				'https://www.googleapis.com/auth/userinfo.profile',
				'https://www.googleapis.com/auth/userinfo.email'
			]
		}));

		this.router.route('/auth/google/callback').get(user.oauthCallback('google'));

		// Setting the yahoo oauth routes
		this.router.route('/auth/yahoo').get(passport.authenticate('yahoo'));
		this.router.route('/auth/yahoo/callback').get(user.oauthCallback('yahoo'));

		//todo - figure out how to unpack the req to pull the user out. Ideally I want to call stockpositions.listdaily and chain the route.
		this.router.route('/user/generateDailyStocksEmail').post(user.generateDailyStocksEmail);

		// Finish by binding the user middleware
		this.router.param('userId', user.userByID);
	}

}

//Create a new instance and expose it.
const userRoutes = new UserRouter();
export default userRoutes.router;
