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
	//Apparently this can't find the children '
	stockPositionsCtrl = require('./stockpositions/sp.base.server.controller'),
	//stockPositionsCtrl = require('./stockpositions.server.controller'),
	Quote = mongoose.model('Quote'),
	Fundamentals = mongoose.model('Fundamentals'),
	Performance = mongoose.model('Performance');

/**
 * Create a Quote
 */
function create(req, res) {
	var quote = new Quote(req);

	quote.save(function(err) {
		if (err) {
			return res.status(400).send({message: errorHandler.getErrorMessage(err)
			});
		}
		else {
			res = quote;
		} 
	});
}

/**
 * Initialize the YQL commands 
 */
function init()
{
	yql.formatAsJSON().withOAuth(config.yahoo.clientID,config.yahoo.clientSecret);
	//To have access to all the community tables 
	yql.setQueryParameter({
		env: 'store://datatables.org/alltableswithkeys'
	});
}

/**
 * Update a Quote
 */
function update(req, res) {
	var quote = req;

	quote = _.extend(quote , req);
	var quoteObj = new Quote(quote);

	quoteObj.save(function(err) {
		if (err) {
			return res.status(400).send({message: errorHandler.getErrorMessage(err)
			});
		} 
		else {
			res = quoteObj;
		}
	});
}

/**
 * Update references to the other records associated with a quote
 * Also call a price update to the any stock positions that exists.  
 */
function updateReferences(response, symbol, yahooSymbol, res) {
	var query = {'Symbol': symbol},
		options = {'upsert': true, 'new': true, 'setDefaultOnInsert': true},
		quoteResponse = JSON.parse(response).query.results.quote;

	quoteResponse.YahooSymbol = yahooSymbol;
	quoteResponse.Symbol = symbol;
	quoteResponse.lastUpdate = Date.now;

	async.parallel({
		quote: function (callback) {
			Quote.findOneAndUpdate(query, quoteResponse, options, function (err) {
				callback(err);
			});
		},
		fundamaentals: function (callback) {
			Fundamentals.findOneAndUpdate(query, quoteResponse, options, function (err) {
				callback(err);
			});
		},
		performance: function (callback) {
			Performance.findOneAndUpdate(query, quoteResponse, options, function (err) {
				callback(err);
			});
		},
		stockPositions: function(callback) {
			stockPositionsCtrl.updatePriceInner(symbol, quoteResponse.LastTradePriceOnly, function(err) {
				callback(err);
			});
		}
	},
	function (err) {
		if (err) {
			return res.status(400).send({message: errorHandler.getErrorMessage(err)});
		}

		//The result from the calls will be an object that needs to be unwrapped
		//Right now I just need the initial query result. 
		res.jsonp(quoteResponse);
	});
}

exports.yahooQuote = function(symbol, res) {
	init();
	var exchange = 'TO'; // TSX is TO in YQL. Make this dynamic once I support other exchanges 
	var yahooSymbol = symbol.concat('.', exchange); 
	var query = 'select * from yahoo.finance.quotes where symbol in ("'.concat(yahooSymbol).concat('");');

	yql.execute(query, function(err,results) {
		if (err) {
			return res.status(400).send({message: errorHandler.getErrorMessage(err)});
		} else {
			return updateReferences(results, symbol, yahooSymbol, res);
		}
	});
};

exports.yahooQuotes = function(symbols, res) {
	init();

	var symbols1 = symbols.join('","');
	var query = 'select * from yahoo.finance.quotes where symbol in ("'.concat(symbols1).concat('");');

	yql.execute(query, function(err,results) {
		if (err) {
			console.log('Eror:', err);
		} else {
			res(results);
		}
	});
};

/**
* QuoteById 
* Fetch a stock quote by Id 
*/
exports.quoteByID = function(req, res, next, id) {
	Quote.findById(id).populate('user', 'displayName').exec(function(err, quote) {
		if (err) return next(err);
		if (! quote) return next(new Error('Failed to load Quote ' + id));
		req.quote = quote;
		next();
	});
};
