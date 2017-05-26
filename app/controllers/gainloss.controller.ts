import { Model as model, Mongoose as mongoose } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import * as _ from 'lodash';
import * as errorHandler from './error.controller';
import { IGainLossModel } from '../models/gainloss.model';

let GainLoss = new model('GainLoss');

/**
 * Create a GainLoss
 */
export function create(req: Request, res: Response) {
	let gainLoss = new GainLoss(req.body);
	gainLoss.user = req.user;

	gainLoss.save(function (err: Error) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		else {
			res.jsonp(gainLoss);
		}
	});
};

/**
 * Show the current GainLoss
 */
export function read(req: Request, res: Response) {
	res.jsonp(req.body.gainLoss);
};

/**
 * Update a GainLoss
 */
export function update(req: Request, res: Response) {
	let gainLoss = req.body.gainLoss;

	gainLoss = _.extend(gainLoss, req.body);

	gainLoss.save(function (err: Error) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gainLoss);
		}
	});
};

/**
 * Delete an GainLoss
 */
export function delete1(req: Request, res: Response) {
	let gainLoss = req.body.gainLoss;

	gainLoss.remove(function (err: Error) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			if (err) { return res.status(400).send({ message: errorHandler.getErrorMessage(err) }); }

			res.jsonp(gainLoss);
		}
	});
};

/**
 * List of GainLoss
 */
export function list(req: Request, res: Response) {

	let query = GainLoss.find(),
		pagination = {
			start: ((req.query.page || 1) - 1) * (req.query.count || 50),
			count: req.query.count || 50
		};

	if (req.query.filter && !_.isEmpty(req.query.filter) && req.query.filter.length > 2) {

		let filter = JSON.parse(req.query.filter);

		if (filter.settlementDate) {
			query.where('settlementDate').in(JSON.parse(req.query.filter).date);
		}

		if (filter.accountType) {
			query.where('accountType').in(JSON.parse(req.query.filter).accountType);
		}

		if (filter.symbol) {
			query.where('symbol').in(JSON.parse(req.query.filter).symbol.toUpperCase().split(','));
		}
	}

	if (req.query.sort && req.query.sort.length > 2) {
		let sortKey = JSON.parse(req.query.sort).predicate,
			direction = JSON.parse(req.query.sort).reverse ? 'desc' : 'asc';

		query.sort({ [sortKey]: direction });
	}
	else {
		query.sort({ date: 'asc' });
	}

	query.page(pagination, function (err: Error, gainLosss: IGainLossModel) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gainLosss);
		}
	});
};

/**
 * GainLoss middleware
 */
export function gainLossByID(req: Request, res: Response, next: NextFunction, id: Number) {
	GainLoss.findById(id).populate('user', 'displayName').exec(function (err: Error, gainLoss: IGainLossModel) {
		if (err) {
			return next(err);
		}
		if (!gainLoss) {
			return next(new Error('Failed to load GainLoss ' + id));
		}
		req.body.gainLoss = gainLoss;
		next();
	});
};

/**
 * GainLoss authorization middleware
 */
export function hasAuthorization(req: Request, res: Response, next: NextFunction) {
	if (req.user.id !== req.user.id) {
		return res.status(403).send({ message: 'User is not authorized' });
	}
	next();
};
