import { Model as model, Mongoose as mongoose } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import * as _ from 'lodash';
import * as errorHandler from './error.controller';
import { IIncomeModel } from '../models/income.model';

let Income = new model('Income');

/**
 * Create a Income
 * @param req
 * @param res
 */
export function create(req: Request, res: Response) {
	let income = new Income(req.body);
	income.user = req.user;

	income.save(function (err: Error) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		else {
			res.jsonp(income);
		}
	});
};

/**
 * Show the current Income
 * @param req
 * @param res
 */
export function read(req: Request, res: Response) {
	res.jsonp(req.body.income);
};

/**
 * Update a Income
 * @param req
 * @param res
 */
export function update(req: Request, res: Response) {
	let income = req.body.income;

	income = _.extend(income, req.body);

	income.save(function (err: Error) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(income);
		}
	});
};

/**
 * Delete an Income
 * @param req
 * @param res
 */
export function delete1(req: Request, res: Response) {
	let income = req.body.income;

	income.remove(function (err: Error) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			if (err) { return res.status(400).send({ message: errorHandler.getErrorMessage(err) }); }

			res.jsonp(income);
		}
	});
};

/**
 * List of Income - not currently used
 * @param req
 * @param res
 */
export function list(req: Request, res: Response) {

	let query = Income.find(),
		pagination = {
			start: ((req.query.page || 1) - 1) * (req.query.count || 50),
			count: req.query.count || 50
		};

	if (req.query.sort && req.query.sort.length > 2) {
		let sortKey = JSON.parse(req.query.sort).predicate,
			direction = JSON.parse(req.query.sort).reverse ? 'desc' : 'asc';

		query.sort({ [sortKey]: direction });
	}
	else {
		query.sort({ date: 'asc' });
	}

	query.page(pagination, function (err: Error, incomes: IIncomeModel[]) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(incomes);
		}
	});
};

/**
 * Attempts to parse and group by the corporations name.
 * Because we don't have any sort of symbol or other information.
 * @param req
 * @param res
 */
export function listByDescription(req: Request, res: Response) {

	let query = Income.find(),
		pagination = {
			start: ((req.query.page || 1) - 1) * (req.query.count || 50),
			count: req.query.count || 50
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

	Income.aggregate([
		{
			$group: {
				_id: '$description',
				totalmv: { $sum: '$market' },
				totalbook: { $sum: '$book' }
			}
		}
	],
		function (err: Error, result: IIncomeModel) {

			let income = new Income();

			if (err) {
				return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
			} else {
				res.jsonp(result);
			}
		});
};

/**
 * Income middleware
 * @param req
 * @param res
 * @param next
 * @param id
 */
export function incomeByID(req: Request, res: Response, next: NextFunction, id: Number) {
	Income.findById(id).populate('user', 'displayName').exec(function (err: Error, income: IIncomeModel) {
		if (err) {
			return next(err);
		}
		if (!income) {
			return next(new Error('Failed to load Income ' + id));
		}
		req.body.income = income;
		next();
	});
};

/**
 * Income authorization middleware
 * @param req
 * @param res
 * @param next
 */
export function hasAuthorization(req: Request, res: Response, next: NextFunction) {
	if (req.user.id !== req.user.id) {
		return res.status(403).send({ message: 'User is not authorized' });
	}
	next();
};
