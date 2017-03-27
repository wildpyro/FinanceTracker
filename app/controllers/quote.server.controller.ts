'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	passport = require('passport'),
	_ = require('lodash'),
	async = require('async'),
	yql = require('yql-node'),
	config = require('../../config/config'),
	errorHandler = require('./errors.server.controller'),
	stockPositionsCtrl = require('./stockpositions/sp.base.server.controller'),
	QUOTE = mongoose.model('Quote'),
	FUNDATMENTALS = mongoose.model('Fundatmentals'),
	PERFORMANCE = mongoose.model('Performance');

/**
 * Create a QUOTE
 */
function create(req, res) {
	var quote = new QUOTE(req);

	quote.save(function (err) {
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
function prepSymbols(symbols) {
	function cleanUp(symbol) {
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
function update(req, res) {
	var quote = req;

	quote = _.extend(quote, req);
	var quoteObj = new QUOTE(quote);

	quoteObj.save(function (err) {
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
function updateReferences(response, symbol, yahooSymbol, res) {
	var query = { 'Symbol': symbol },
		options = { 'upsert': true, 'new': true, 'setDefaultOnInsert': true },
		quoteResponse = JSON.parse(response).query.results.quote;

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
			FUNDATMENTALS.findOneAndUpdate(query, quoteResponse, options, function (err) {
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

exports.yahooQUOTE = function (symbol, res) {
	init();

	var yahooSymbol = prepSymbols([symbol]);

	var query = 'select * from yahoo.finance.quotes where symbol in ("'.concat(yahooSymbol).concat('");');

	yql.execute(query, function (err, results) {
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
exports.yahooQUOTEs = function (symbols, res) {
	init();

	var symbols1 = prepSymbols(symbols);
	var query = 'select * from yahoo.finance.quotes where symbol in ("'.concat(symbols1).concat('");');

	yql.execute(query, function (err, results) {
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
exports.quoteByID = function (req, res, next, id) {
	QUOTE.findById(id).populate('user', 'displayName').exec(function (err, quote) {
		if (err) {
			return next(err);
		}

		if (!quote) {
			return next(new Error('Failed to load QUOTE ' + id));
		}
		req.quote = quote;
		next();
	});
};
