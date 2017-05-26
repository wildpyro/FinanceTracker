import { Model as model, Mongoose as mongoose } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import * as _ from 'lodash';
import * as errorHandler from '../error.controller';
import * as exchanges from '../../enums/exchanges.enums';
import { Account } from '../account.controller';
import { IStockpositionModel } from '../../models/stockposition.model';
import { IAccountModel } from '../../models/account.model';
import { IUserModel } from '../../models/user.model';
import { IQuoteModel } from '../../models/quote.model';
import { ICallback } from '../../types/callback.types';

let Quote = new model('Quote');

/**
* Update references either add, delete or check
**/
function updateReferences(action: string, stockposition: IStockpositionModel): Error {
	Account
		.findOne({ 'accountType': stockposition.accountType }, function (err: Error, account: IAccountModel) {
			if (err) { return err; }
			else {
				if (account !== undefined) {
					if (action === 'add') {
						if (account.stockPositions === undefined || account.stockPositions === null) {
							account.stockPositions = null;
						}

						account.stockPositions.push(stockposition);
					}
					else if (action === 'remove') {
						if (account.stockPositions !== undefined && account.stockPositions !== null) {
							account.stockPositions.pop();
						}
					}
					else if (action === 'check') {
						if (account.stockPositions !== undefined && account.stockPositions !== null) {
							if (!account.stockPositions.indexOf(stockposition)) {
								account.stockPositions.push(stockposition);
							}
							//Look through and make sure all the references are correct.
							else {
								Account.find({}, function (err: Error, accounts: IAccountModel[]) {
									accounts.forEach(function (account: IAccountModel) {
										account.stockPositions.forEach(function (stockposition: IStockpositionModel) { }, this);
									}, this);
								});
							}
						}

					}

					account.save(function (err: Error) {
						if (err) { return err; }
						else {
							return null;
						}
					});
				}
			}
		});

	return null;
};

/**
 * Check to ensure we aren't adding duplicate symbols to the same accounttype
 * @param req
 * @param res
 * @param next
 */
export function checkDuplicates(req: Request, res: Response, next: NextFunction) {
	let stockposition = new Stockposition(req.body);
	Stockposition.findOne({ 'accountType': stockposition.accountType, 'symbol': stockposition.symbol },
		function (err: Error, duplicate: IStockpositionModel) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			}
			else {
				if (duplicate !== null && duplicate !== undefined) {
					return res.status(400).send({ message: 'Stock already exists for the account' });
				}
			}

			next();
		});
};

/**
 * Create a Stockposition
 * @param req
 * @param res
 */
export function create(req: Request, res: Response) {
	let stockposition = new Stockposition(req.body);
	stockposition.user = req.user;

	stockposition.save(function (err: Error) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		else {
			err = updateReferences('add', stockposition);

			if (err) { return res.status(400).send({ message: errorHandler.getErrorMessage(err) }); }

			res.jsonp(stockposition);
		}
	});
};

/**
 * Delete an Stockposition
 * @param req
 * @param res
 */
export function deleteBase(req: Request, res: Response) {
	let stockposition = req.body.stockposition;

	stockposition.remove(function (err: Error) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			//remove the reference after? What happens when this fails?
			updateReferences('remove', stockposition);

			if (err) { return res.status(400).send({ message: errorHandler.getErrorMessage(err) }); }

			res.jsonp(stockposition);
		}
	});
};

export function getPositionSymbols(user: IUserModel, callback: any) {
	Stockposition.aggregate(
		[
			{ $match: { type: { $nin: ['cash'] } } },
			{ $match: { exchange: { $ne: 'Funds' } } },
			{
				$group: {
					_id: null,
					symbols: { $addToSet: { $concat: ['$symbol', '.', '$exchange'] } }
				}
			}
		],
		function (err: Error, result: ICallback) {
			if (err) {
				console.log('Error:', err);
			}

			callback(null, result[0].symbols);
		});
};

/**
 * Stockposition authorization middleware
 * @param req
 * @param res
 * @param next
 */
export function hasAuthorization(req: Request, res: Response, next: NextFunction) {
	if (req.body.stockposition.user.id !== req.user.id) {
		return res.status(403).send({ message: 'User is not authorized' });
	}
	next();
};

/**
 * List of Stockpositions
 * @param req
 * @param res
 */
export function listBase(req: Request, res: Response) {

	let query = Stockposition.find(),
		pagination = {
			start: ((req.query.page || 1) - 1) * (req.query.count || 50),
			count: req.query.count || 50
		};

	//Filter
	if (req.query.filter && !_.isEmpty(req.query.filter) && req.query.filter.length > 2) {
		query.where('symbol').in(JSON.parse(req.query.filter).symbol.toUpperCase().split(','));
	}

	//Sort
	if (req.query.sort && req.query.sort.length > 2) {
		let sortKey = JSON.parse(req.query.sort).predicate,
			direction = JSON.parse(req.query.sort).reverse ? 'desc' : 'asc';

		query.sort({ [sortKey]: direction });
	}
	else {
		query.sort({ type: 'asc', symbol: 'asc', accountType: 'asc' });
	}

	query.page(pagination, function (err: Error, stockpositions: IStockpositionModel) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(stockpositions);
		}
	});
};

/**
 * Find the stockpositions you currently hold
 * Get the updated ones from yahoo
 * Currently this doesn't use the User but it should
 * @param user
 * @param callback
 */
export function listDaily(user: IUserModel, callback: any) {
	this.getPositionSymbols(user, function (err: Error, symbols: string[]) {
		Quote.yahooQuotes(symbols, function (err: Error, newQuotes: IQuoteModel[]) {
			if (err) {
				callback(err, null);
			}
			callback(null, newQuotes);
		});
	});
};

/**
 * Show the current Stockposition
 * @param req
 * @param res
 */
export function readBase(req: Request, res: Response) {
	res.jsonp(req.body.stockposition);
};

/**
 * Stockposition middleware
 * @param req
 * @param res
 * @param next
 * @param id
 */
export function stockpositionByID(req: Request, res: Response, next: NextFunction, id: number) {
	Stockposition.findById(id).populate('user', 'displayName').exec(function (err: Error, stockposition: IStockpositionModel) {
		if (err) {
			return next(err);
		}

		if (!stockposition) {
			return next(new Error('Failed to load Stockposition ' + id));
		}

		req.body.stockposition = stockposition;
		next();
	});
};

/**
 * Update a Stockposition
 * @param req
 * @param res
 * @param next
 */
export function update(req: Request, res: Response, next: NextFunction) {
	let stockposition = req.body.stockposition;

	stockposition = _.extend(stockposition, req.body);

	stockposition.save(function (err: Error) {
		if (err) {
			next({ message: errorHandler.getErrorMessage(err) });
			//res.status(400).send({message: errorHandler.getErrorMessage(err)});
		}
		else {
			updateReferences('check', stockposition);

			res.jsonp(stockposition);
		}

		next();
	});
};

/**
 * Helper to update all prices in one shot
 * @param symbol
 * @param price
 * @param callback
 */
export function updatePriceInner(symbol: string, price: number, callback: any) {
	//Strip off the exchange and search by both
	let re = /.([^.]*)$/;

	let symbolAndExchange = symbol.split(re);
	let query = Stockposition.find();

	let symbolOnly = symbolAndExchange[0].replace('-', '.'),
		exchange = exchanges.getByYahooCode(symbolAndExchange[1]);

	query.where('symbol', symbolOnly);
	query.where('exchange', exchange);
	query.exec(function (err: Error, results: IStockpositionModel[]) {
		if (err) {
			callback(err, null);
		}
		else {
			results.forEach(function (result: IStockpositionModel) {
				result.price = price;
				//Round this later?
				result.market = Number(price * result.shares);
				result.save(function (err: Error, result: any) {
					if (err) {
						callback(err, null);
					}

					callback(null, result);
				});
			});
		}
	});
};

/**
 * Used for single manual prices updates from UI.
 * @param req
 * @param res
 * @param next
 */
export function updatePrice(req: Request, res: Response, next: NextFunction) {
	updatePriceInner(req.body.stockposition.symbol, req.body.stockposition.price, function (err: Error, updated: any) {
		// TODO - Figure out how to handle multi-level errors. Previous stage should not be calling next?
		//		if (err) {
		//			return res.status(400).send({message: errorHandler.getErrorMessage(err)});
		//		}
	});
};

/**
 * Used for wholesale prices updates from UI.
 * @param req
 * @param res
 * @param next
 */
export function updatePrices(req: Request, res: Response, next: NextFunction) {
	listDaily(req.user, function (err: Error, quoteResponses: ICallback) {
		if (err) {
			return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
		}
		else {
			let results = JSON.parse(quoteResponses).query.results.quote;
			_.forIn(results, function (value: IQuoteModel, key) {
				updatePriceInner(value.Symbol, value.LastTradePriceOnly, function (err: Error, updated: any) {
					if (err) {
						return res.status(400).send({ message: value.Symbol + ': ' + errorHandler.getErrorMessage(err) });
					}
				});
			});
		}
	});
};
