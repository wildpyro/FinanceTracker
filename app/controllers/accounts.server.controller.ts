import { Mongoose as mongoose} from 'mongoose';
import { Model as model} from 'mongoose';
import { lodash as _} from 'lodash';
import * as ErrorHandler from './errors.server.controller';
import {Request, Response, NextFunction} from 'express';

var Account = new model('Account');

/**
 * Create a ACCOUNT
 */
exports.create = function(req: any, res: any) {
	var account = new Account(req.body);

	account.user = req.user;
	account.save(function(err: string) {
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
 * Show the current ACCOUNT
 */
exports.read = function(req: any, res: any) {
	res.jsonp(req.account);
};

/**
 * Update a ACCOUNT
 */
exports.update = function(req: any, res: any) {
	var account = req.account ;

	account = _.extend(account , req.body);

	account.save(function(err: string) {
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
 * Delete an ACCOUNT
 */
exports.delete = function(req: any, res: any) {
	var account = req.account ;

	account.remove(function(err : string) {
		if (err) {
			return res.status(400).send({message: ErrorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(account);
		}
	});
};

/**
 * List of ACCOUNTs
 */
exports.list = function(req: any, res: any) {

	var sort;
	var sortObject = {};
	var count = req.query.count || 5;
	var page = req.query.page || 1;

	var filter = {
		filters : {
			mandatory : {
				contains: req.query.filter
			}
		}
	};

	var pagination = {
		start: (page - 1) * count,
		count: count
	};

	if (req.query.sorting) {
		var sortKey = Object.keys(req.query.sorting)[0];
		var sortValue = req.query.sorting[sortKey];
		sortObject[sortValue] = sortKey;

		sort = {
			sort: sortObject
		};
	} else {
		sort = {accountType: 'asc'};
	}

	Account
		.find()
		.filter(filter)
		.populate({path: 'stockPositions', model: 'Stockposition', options: {sort: {type: 'desc', symbol: 'asc'}}})
		.sort(sort)
		.page(pagination, function(err : string, accounts : any){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
  				for (var i = accounts.results.length - 1; i >= 0; i--) {
  					var balance = 0;

  					//loop through the stock positions to get there current market value
  					for (var y = accounts.results[i].stockPositions.length - 1; y >= 0; y--) {
  						balance += accounts.results[i].stockPositions[y].market;
  					}

  					accounts.results[i].marketValue = Number(balance).toFixed(2);
  				}

				res.jsonp(accounts);
			}
		});
};

/**
 * Load the account drop down
 */
exports.fetchAccountNos = function(req: any, res: any) {
	var query = Account.find();

	query.select('description accountNo');
	query.exec(function(err : string, results: [Account]) {
		if (err) {
			return res.status(400).send({message: errorHandler.getErrorMessage(err)});
		}

		res.jsonp(results);
	});
};

/**
 * Account middleware
 */
exports.accountByID = function(req: any, res: any, next: NextFunction, id: number) {
	Account.findById(id).populate('user', 'displayName').exec(function(err : string, account : Account) {
		if (err) {
			return next(err);
		}

		if (! account) {
			return next(new Error('Failed to load ACCOUNT ' + id));
		}

		req.account = account ;
		next();
	});
};

/**
 * Account authorization middleware
 */
exports.hasAuthorization = function(req: any, res: any, next: NextFunction) {
	if (req.account.user.id !== req.user.id) {
		return res.status(403).send({message: 'User is not authorized'});
	}
	next();
};
