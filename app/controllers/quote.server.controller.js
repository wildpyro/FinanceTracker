'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	passport = require('passport'),
	config = require('../../config/config'),
	errorHandler = require('./errors.server.controller'),
	Quote = mongoose.model('Quote'),
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

exports.yahooQuote = function(symbol, res) {

	console.log('yahoo');

	// TSX is TO in YQL. Make this dynamic once I support other exchanges 
	var exchange = 'TO';
	var yahooSymbol = symbol.concat('.', exchange);
	var query = 'select * from yahoo.finance.quote where symbol in ("'.concat(yahooSymbol).concat('");');

	yql.formatAsJSON().withOAuth(config.yahoo.clientID,config.yahoo.clientSecret);
	yql.execute(query, true, function(err,response) {

		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {

			var query = {'Symbol': symbol},
				options = {'upsert': true, 'new': true, 'setDefaultOnInsert': true},
				quoteResponse = JSON.parse(response).query.results.quote;

			quoteResponse.Symbol = symbol;
			quoteResponse.YahooSymbol = yahooSymbol;
			quoteResponse.lastUpdate = Date.now;
			quoteResponse.LastPrice = quoteResponse.LastTradePriceOnly;

			var direction = quoteResponse.Change.substring(0,1),
				changeAmount = quoteResponse.Change.substring(1);

			console.log('got here');

			if (direction === '-') {
				quoteResponse.OpenPrice = Number(quoteResponse.LastTradePriceOnly) - Number(changeAmount);
			}
			else {
				quoteResponse.OpenPrice = Number(quoteResponse.LastTradePriceOnly) + Number(changeAmount);
			}

			Quote.findOneAndUpdate(query, quoteResponse, options, function (err, quote) {
				if (err) {
					console.log(err);
  					return res.status(400).send({message: errorHandler.getErrorMessage(err)});
  				}
  				else {
					res.jsonp(quote);
				}
			});
		}
	});
};

/**
* Local Search 
* when no connection is available, try and see if we have anything stored
**/
exports.localSearch = function(symbol, res) {

	console.log('local');

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