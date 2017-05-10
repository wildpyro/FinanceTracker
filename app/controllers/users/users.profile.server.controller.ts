import { Mongoose as mongoose, Model as model } from 'mongoose';
import { lodash as _ } from 'lodash';
import * as passport from 'passport';
import { Request, Response, NextFunction } from 'express';
import * as errorHandler from '../error.controller';
import * as mailer from 'nodemailer';

/**
 * Update user details
 * @param req
 * @param res
 */
export function update(req: Request, res: Response) {
	// Init Variables
	var user = req.body.user;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function (err: string) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.body.login(user, function (err: string) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 * Send User
 * @param req
 * @param res
 */
export function me(req: Request, res: Response) {
	res.json(req.body.user || null);
};

/**
 * Currently this doesn't work
 * Manual process for sending the stock position daily email
 * @param req
 * @param res
 */
export function generateDailyStocksEmail(req: Request, res: Response) {
	/*mailer.sendMail(req.body.user, function (err: string) {
		if (err) {
			res.status(400).send(err);
		}
		else {
			res.status(200).send({ message: 'Email generated and sent' });
		}
	});*/
};
