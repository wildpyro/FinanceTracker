'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	passport = require('passport'),
	config = require('../../config/config'),
	errorHandler = require('./errors.server.controller'),
	Quote = mongoose.model('Quote'),
	Fundamentals = mongoose.model('Fundamentals'),
	Performance = mongoose.model('Performance'),
	_ = require('lodash'),
	yql = require('yql-node');

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
 */
function updateReferences(response, symbol, yahooSymbol, res) {
	var query = {'Symbol': symbol},
		options = {'upsert': true, 'new': true, 'setDefaultOnInsert': true},
		quoteResponse = JSON.parse(response).query.results.quote;

	quoteResponse.YahooSymbol = yahooSymbol;
	quoteResponse.Symbol = symbol;
	quoteResponse.lastUpdate = Date.now;

	Quote.findOneAndUpdate(query, quoteResponse, options, function (err, quote) {
		if (err) {
			return res.status(400).send({message: errorHandler.getErrorMessage(err)});
		}
		else {
			Fundamentals.findOneAndUpdate(query, quoteResponse, options, function (err, quote) {
				if (err) {
					return res.status(400).send({message: errorHandler.getErrorMessage(err)});
				}
				else {
					Performance.findOneAndUpdate(query, quoteResponse, options, function (err, quote) {
						if (err) {
							return res.status(400).send({message: errorHandler.getErrorMessage(err)});
						}
						else {
							res.jsonp(quoteResponse);
						}
					});
				}
			});
		}
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
* Local Search 
* when no connection is available, try and see if we have anything stored
**/
exports.localSearch = function(symbol, res) {

	var query = Quote.findOne({'Symbol': symbol});

	query.exec(function(err, quote ) {
		if (err) {
			return res.status(400).send({message: errorHandler.getErrorMessage(err)});
		}
  		else {
			res.jsonp(quote);					
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