import { Model as model, Mongoose as mongoose } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import * as _ from 'lodash';
import * as async from 'async';
import * as passport from 'passport';
import * as yql from 'yql-node';
import * as errorHandler from './error.controller';
import * as stockposition from './stockposition/sp.base.server.controller';
import * as config from '../../config/config';

let QUOTE = new model('Quote');
let FUNDATMENTAL = new model('Fundatmental');
let PERFORMANCE = new model('Performance');

/**
 * Create a Quote
 */
function create(req: Request, res: Response) {
	var quote = new QUOTE(req);

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
	yql.formatAsJSON().withOAuth(config.yahoo.clientID, config.yahoo.clientSecret);
	//To have access to all the community tables
	yql.setQueryParameter({
		env: 'store://datatables.org/alltableswithkeys'
	});
}

/**
 * Clean up the symbols to put them in yahoo quote format
 */
function prepSymbols(symbols: String[]) {
	function cleanUp(symbol: String) {
		var re = /[.]/g;

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
 * Update a QUOTE
 */
function update(req: Request, res: Response) {
	var quote = req;

	quote = _.extend(quote, req);
	var quoteObj = new QUOTE(quote);

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
function updateReferences(response: Response, symbol: String, yahooSymbol: String, res: Response) {
	var query = { 'Symbol': symbol },
		options = { 'upsert': true, 'new': true, 'setDefaultOnInsert': true },
		quoteResponse = JSON.parse(response.body).query.results.quote;

	quoteResponse.YahooSymbol = yahooSymbol;
	quoteResponse.Symbol = symbol;
	quoteResponse.lastUpdate = Date.now;

	async.parallel({
		quote: function (callback) {
			QUOTE.findOneAndUpdate(query, quoteResponse, options, function (err) {
				callback(err);
			});
		},
		fundamaentals: function (callback) {
			FUNDATMENTAL.findOneAndUpdate(query, quoteResponse, options, function (err) {
				callback(err);
			});
		},
		performance: function (callback) {
			PERFORMANCE.findOneAndUpdate(query, quoteResponse, options, function (err) {
				callback(err);
			});
		},
		stockPositions: function (callback) {
			stockPositionsCtrl.updatePriceInner(symbol, quoteResponse.LastTradePriceOnly, function (err) {
				callback(err);
			});
		}
	},
		function (err) {
			if (err) {
				return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
			}

			//The result from the calls will be an object that needs to be unwrapped
			//Right now I just need the initial query result.
			res.jsonp(quoteResponse);
		});
}

export function yahooQuote(symbol: String, res: Response) {
	init();

	var yahooSymbol = prepSymbols([symbol]);
	var query = 'select * from yahoo.finance.quotes where symbol in ("'.concat(yahooSymbol.join(',')).concat('");');

	yql.execute(query, function (err: Error, results: Response) {
		if (err) {
			return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
		} else {
			return updateReferences(results, symbol, yahooSymbol, res);
		}
	});
};

/**
 * Returns the current prices from yahoo for a set of symbols. Symbols should be suffixed with .<<Exchange>>
 */
exports.yahooQUOTEs = function (symbols: String[], res: Response) {
	init();

	var symbols1 = prepSymbols(symbols);
	var query = 'select * from yahoo.finance.quotes where symbol in ("'.concat(symbols1.join(',')).concat('");');

	yql.execute(query, function (err: Error, results) {
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
	QUOTE.findById(id).populate('user', 'displayName').exec(function (err: Error, quote) {
		if (err) {
			return next(err);
		}

		if (!quote) {
			return next(new Error('Failed to load QUOTE ' + id));
		}
		req.body.quote = quote;
		next();
	});
};
