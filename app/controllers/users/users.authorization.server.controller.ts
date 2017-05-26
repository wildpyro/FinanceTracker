import { Mongoose as mongoose, Model as model } from 'mongoose';
import { lodash as _ } from 'lodash';
import * as errorHandler from '../error.controller';
import { Request, Response, NextFunction } from 'express';
import * as IUser from '../../models/user.model';

let User = new model('User');

/**
 * get by user id
 * @param req
 * @param res
 * @param next
 * @param id
 */
export function userByID(req: Request, res: Response, next: NextFunction, id: any) {
	User.findOne({ _id: id }).exec(function (err: any, user: IUser.IUserModel) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return next(new Error('Failed to load User ' + id));
		}
		req.body.profile = user;
		next();
	});
};

/**
 * Verify that the user is logged in
 * @param req
 * @param res
 * @param next
 */
export function requiresLogin(req: Request, res: Response, next: NextFunction) {
	if (!req.body.isAuthenticated()) {
		return res.status(401).send({
			message: 'User is not logged in'
		});
	}

	next();
};

/**
 * User authorizations routing middleware
 * @param roles
 */
export function hasAuthorization(roles: string) {
	let _this = this;

	return function (req: Request, res: Response, next: NextFunction) {
		_this.requiresLogin(req, res, function () {
			if (_.intersection(req.body.user.roles, roles).length) {
				return next();
			} else {
				return res.status(403).send({
					message: 'User is not authorized'
				});
			}
		});
	};
};
