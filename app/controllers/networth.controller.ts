import { Model as model, Mongoose as mongoose } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import * as _ from 'lodash';
import * as errorHandler from './error.controller';
import { ISort } from '../types/sort.types';
import { INetworthModel } from '../models/networth.model';

let Networth = new model('networth');

export function create(req: Request, res: Response) {
	let networth = new Networth(req.body);
	networth.user = req.body.user;

	networth.save(function (err: Error) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(networth);
		}
	});
};

/**
 * Show the current Networth
 */
export function read(req: Request, res: Response) {
	res.jsonp(req.body.networth);
};

/**
 * Update a Networth
 */
export function update(req: Request, res: Response) {
	let networth = req.body.networth;

	networth = _.extend(networth, req.body);

	networth.save(function (err: Error) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(networth);
		}
	});
};

/**
 * Delete an Networth
 */
export function delete1(req: Request, res: Response) {
	let networth = req.body.networth;

	networth.remove(function (err: Error) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(networth);
		}
	});
};

/**
 * List of Networths
 */
export function list(req: Request, res: Response) {

	let query = Income.find(),
		pagination = {
			start: ((req.query.page || 1) - 1) * (req.query.count || 50),
			count: req.query.count || 50
		};

	let filter = {
		filters: {
			mandatory: {
				contains: req.query.filter
			}
		}
	};

	//Sort
	if (req.query.sort && req.query.sort.length > 2) {
		let sortKey = JSON.parse(req.query.sort).predicate,
			direction = JSON.parse(req.query.sort).reverse ? 'desc' : 'asc';

		query.sort({ [sortKey]: direction });
	}
	else {
		query.sort({ date: 'asc' });
	}

	Networth.page(pagination, function (err: Error, networths: INetworthModel) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		else {
			res.jsonp(networths);
		}
	});
};

/**
 * Networth middleware
 */
export function networthByID(req: Request, res: Response, next: NextFunction, id: Number) {
	Networth.findById(id).populate('user', 'displayName').exec(function (err: Error, networth: INetworthModel) {
		if (err) {
			return next(err);
		}

		if (!networth) {
			return next(new Error('Failed to load Networth ' + id));
		}

		req.body.networth = networth;
		next();
	});
};

/**
 * Networth authorization middleware
 */
export function hasAuthorization(req: Request, res: Response, next: NextFunction) {
	if (req.body.networth.user.id !== req.user.id) {
		return res.status(403).send({ message: 'User is not authorized' });
	}
	next();
};
