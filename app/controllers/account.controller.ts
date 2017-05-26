import { Mongoose as mongoose, Model as model } from 'mongoose';
import { lodash as _ } from 'lodash';
import { Request, Response, NextFunction } from 'express';
import * as ErrorHandler from './error.controller';
import { IAccountModel } from '../models/account.model';

export let Account = new model('Account');

class AccountModel {

	private _accountModel: IAccountModel;

	constructor(accountModel: IAccountModel) {
		this._accountModel = accountModel;
	}

	/**
	 * Create an account
	 * @param req
	 * @param res - the callback
	 */
	create(req: Request, res: Response) {
		let account: IAccountModel = <IAccountModel>req.body;
		//let account = new Account(req.body);

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
	read(req: Request, res: Response) {
		res.jsonp(req.body.account);
	};

	/**
	 * Update the account
	 * @param req
	 * @param res - the callback
	 */
	update(req: Request, res: Response) {
		let account = req.body.account;

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
	delete1(req: Request, res: Response) {
		let account = req.body.account;

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
	static list(req: Request, res: Response) {

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
	getAccountNosRQ(req: Request, res: Response) {
		let query = Account.find();

		query.select('description accountNo');
		query.exec(function (err: Error, results: [Account]) {
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
	getAccountNos(user: string): any {
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
	accountByID(req: Request, res: Response, next: NextFunction, id: number) {
		Account.findById(id).populate('user', 'displayName').exec(function (err: any, account: Account) {
			if (err) {
				return next(err);
			}

			if (!account) {
				return next(new Error('Failed to load ACCOUNT ' + id));
			}

			req.body.account = account;
			next();
		});
	};

	/**
	 * Ensure the user has access
	 * @param req
	 * @param res
	 * @param next
	 */
	hasAuthorization(req: any, res: any, next: NextFunction) {
		if (req.account.user.id !== req.user.id) {
			return res.status(403).send({ message: 'User is not authorized' });
		}
		next();
	};
}

Object.seal(AccountModel);
