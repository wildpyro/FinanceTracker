import { Model as model, Mongoose as mongoose } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import * as _ from 'lodash';
import * as async from 'async';
import * as passport from 'passport';
import * as yql from 'yql-node';
import * as errorHandler from './error.controller';
import * as stockpositionCtrl from './stockposition/sp.base.controller';
import * as config from '../../config/config';
import { IQuoteModel } from '../models/quote.model';
import { ICallback } from '../types/callback.types';

let Quote = new model('Quote');
let Fundamental = new model('Fundatmental');
let Performance = new model('Performance');

/**
 * Create a Quote
 */
function create(req: Request, res: Response) {
	let quote = new Quote(req);

	quote.save(function (err: Error) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res = quote;
		}
	});
}

/**
 * Initialize the YQL commands
 */
function init() {
	let yahooConfig = config.getConfig().yahoo;
	yql.formatAsJSON().withOAuth(yahooConfig.clientID, yahooConfig.clientSecret);
	//To have access to all the community tables
	yql.setQueryParameter({
		env: 'store://datatables.org/alltableswithkeys'
	});
}

/**
 * Clean up the symbols to put them in yahoo quote format
 * @param symbols
 */
function prepSymbols(symbols: string[]) {
	function cleanUp(symbol: string) {
		let re = /[.]/g;

		//See if there are more than one period
		if (symbol.match(re).length > 1) {
			symbol = symbol.replace('.', '-');
		}

		symbol = symbol.replace('.TSX', '.TO');

		return symbol;
	}

	return symbols.map(cleanUp);
}

/**
 * Update a Quote
 * @param req
 * @param res
 */
function update(req: Request, res: Response) {
	let quote = req;

	quote = _.extend(quote, req);
	let quoteObj = new Quote(quote);

	quoteObj.save(function (err: String) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res = quoteObj;
		}
	});
}

/**
 * Update references to the other records associated with a quote
 * Also call a price update to any stock positions that exists.
 */
function updateReferences(response: Function, symbol: string, yahooSymbol: string, res: Response) {
	let query = { 'Symbol': symbol },
		options = { 'upsert': true, 'new': true, 'setDefaultOnInsert': true },
		quoteResponse = JSON.parse(response).query.results.quote;

	quoteResponse.YahooSymbol = yahooSymbol;
	quoteResponse.Symbol = symbol;
	quoteResponse.lastUpdate = Date.now;

	async.parallel({
		quote: function (callback: Function) {
			Quote.findOneAndUpdate(query, quoteResponse, options, function (err: Error) {
				callback(err);
			});
		},
		fundamaentals: function (callback: Function) {
			Fundamental.findOneAndUpdate(query, quoteResponse, options, function (err: Error) {
				callback(err);
			});
		},
		performance: function (callback: Function) {
			Performance.findOneAndUpdate(query, quoteResponse, options, function (err: Error) {
				callback(err);
			});
		},
		stockPositions: function (callback: Function) {
			stockpositionCtrl.updatePriceInner(symbol, quoteResponse.LastTradePriceOnly, function (err: Error) {
				callback(err);
			});
		}
	},
		function (err: Error) {
			if (err) {
				return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
			}

			//The result from the calls will be an object that needs to be unwrapped
			//Right now I just need the initial query result.
			res.jsonp(quoteResponse);
		});
}

/**
 * Get a quote of a stock symbol from yahoo
 * @param symbol
 * @param res
 */
export function yahooQuote(symbol: string, res: any) {
	init();

	let yahooSymbol = prepSymbols([symbol]);
	let query = 'select * from yahoo.finance.quotes where symbol in ("'.concat(yahooSymbol.join(',')).concat('");');

	yql.execute(query, function (err: Error, results: Function) {
		if (err) {
			return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
		} else {
			return updateReferences(results, symbol, yahooSymbol[0], res);
		}
	});
};

/**
 * Returns the current prices from yahoo for a set of symbols. Symbols should be suffixed with .<<Exchange>>
 * @param symbols
 * @param res
 */
export function yahooQuotes(symbols: string[], res: any) {
	init();

	let symbols1 = prepSymbols(symbols);
	let query = 'select * from yahoo.finance.quotes where symbol in ("'.concat(symbols1.join(',')).concat('");');

	yql.execute(query, function (err: Error, results: ICallback) {
		if (err) {
			console.log('Eror:', err);
		} else {
			res(null, results);
		}
	});
};

/**
 * QuoteById
 * Fetch a stock quote by Id
 */
export function quoteByID(req: Request, res: Response, next: NextFunction, id: Number) {
	Quote.findById(id).populate('user', 'displayName').exec(function (err: Error, quote: IQuoteModel) {
		if (err) {
			return next(err);
		}

		if (!quote) {
			return next(new Error('Failed to load Quote ' + id));
		}
		req.body.quote = quote;
		next();
	});
};
