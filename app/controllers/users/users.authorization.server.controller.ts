import { Mongoose as mongoose, Model as model } from 'mongoose';
import { lodash as _ } from 'lodash';
import * as errorHandler from '../error.controller';
import { Request, Response, NextFunction } from 'express';
import * as IUser from '../../models/user.interface';

let User = new model('User');

/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
	User.findOne({ _id: id }).exec(function (err: any, user) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return next(new Error('Failed to load User ' + id));
		}
		req.profile = user;
		next();
	});
};

/**
 * Require login routing middleware
 */
exports.requiresLogin = function (req, res, next) {
	if (!req.isAuthenticated()) {
		return res.status(401).send({
			message: 'User is not logged in'
		});
	}

	next();
};

/**
 * User authorizations routing middleware
 */
exports.hasAuthorization = function (roles) {
	var _this = this;

	return function (req, res, next) {
		_this.requiresLogin(req, res, function () {
			if (_.intersection(req.user.roles, roles).length) {
				return next();
			} else {
				return res.status(403).send({
					message: 'User is not authorized'
				});
			}
		});
	};
};