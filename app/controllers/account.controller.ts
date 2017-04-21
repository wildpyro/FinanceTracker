import { Mongoose as mongoose } from 'mongoose';
import { Model as model } from 'mongoose';
import { lodash as _ } from 'lodash';
import * as ErrorHandler from './error.controller';
import { Request, Response, NextFunction } from 'express';

let Account = new model('Account');

/**
 * Create an account
 * @param req
 * @param res - the callback
 */
export function create(req: any, res: any) {
	let account = new Account(req.body);

	account.user = req.user;
	account.save(function (err: any) {
		if (err) {
			return res.status(400).send({
				message: ErrorHandler.getErrorMessage(err)

			});
		} else {
			res.jsonp(account);
		}
	});
};

/**
 * Show the current account
 * @param req
 * @param res - the callback
 */
export function read(req: any, res: any) {
	res.jsonp(req.account);
};

/**
 * Update the account
 * @param req
 * @param res - the callback
 */
export function update(req: any, res: any) {
	let account = req.account;

	account = _.extend(account, req.body);

	account.save(function (err: any) {
		if (err) {
			return res.status(400).send({
				message: ErrorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(account);
		}
	});
};

/**
 * Delete an account
 * @param req
 * @param res - the callback
 */
export function delete1(req: any, res: any) {
	let account = req.account;

	account.remove(function (err: any) {
		if (err) {
			return res.status(400).send({
				message: ErrorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(account);
		}
	});
};

/**
 * List records
 * @param req
 * @param res
 */
export function list(req: any, res: any) {

	let sort;
	let sortObject = {};
	let count = req.query.count || 5;
	let page = req.query.page || 1;

	let filter = {
		filters: {
			mandatory: {
				contains: req.query.filter
			}
		}
	};

	let pagination = {
		start: (page - 1) * count,
		count: count
	};

	if (req.query.sorting) {
		let sortKey = Object.keys(req.query.sorting)[0];
		let sortValue = req.query.sorting[sortKey];
		sortObject[sortValue] = sortKey;

		sort = {
			sort: sortObject
		};
	} else {
		sort = { accountType: 'asc' };
	}

	Account
		.find()
		.filter(filter)
		.populate({ path: 'stockPositions', model: 'Stockposition', options: { sort: { type: 'desc', symbol: 'asc' } } })
		.sort(sort)
		.page(pagination, function (err: any, accounts: any) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				for (let i = accounts.results.length - 1; i >= 0; i--) {
					let balance = 0;

					//loop through the stock positions to get there current market value
					for (let y = accounts.results[i].stockPositions.length - 1; y >= 0; y--) {
						balance += accounts.results[i].stockPositions[y].market;
					}

					accounts.results[i].marketValue = Number(balance).toFixed(2);
				}

				res.jsonp(accounts);
			}
		});
};

/**
 * Not currently used -> an express call
 * @param req
 * @param res
 */
export function getAccountNosRQ(req: any, res: any) {
	let query = Account.find();

	query.select('description accountNo');
	query.exec(function (err: any, results: [Account]) {
		if (err) {
			return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
		}

		res.jsonp(results);
	});
};

/**
 * Load the account drop down
 * @param user the userid to find accounts for
 * @return any
 */
export function getAccountNos(user: string): any {
	let query = Account.find();

	query.select('accountNo');
	query.exec(function (err: any, results: [Account]) {
		if (err) {
			return {};
		}
		return results;
	});

	//Wrap this so that it gets resolved, unpack so that it is an array of strings
};

/**
 * Get by account id
 * @param req
 * @param res
 * @param next
 * @param id
 */
export function accountByID(req: any, res: any, next: NextFunction, id: number) {
	Account.findById(id).populate('user', 'displayName').exec(function (err: any, account: Account) {
		if (err) {
			return next(err);
		}

		if (!account) {
			return next(new Error('Failed to load ACCOUNT ' + id));
		}

		req.account = account;
		next();
	});
};

/**
 * Ensure the user has access
 * @param req
 * @param res
 * @param next
 */
export function hasAuthorization(req: any, res: any, next: NextFunction) {
	if (req.account.user.id !== req.user.id) {
		return res.status(403).send({ message: 'User is not authorized' });
	}
	next();
};
