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

	// TSX is TO in YQL. Make this dynamic once I support other exchanges 
	var exchange = 'TO';
	var yahooSymbol = symbol.concat('.', exchange);
	//Try out the quotes table, it has a ton more info. 
	var query = 'select * from yahoo.finance.quotes where symbol in ("'.concat(yahooSymbol).concat('");');

	yql.formatAsJSON().withOAuth(config.yahoo.clientID,config.yahoo.clientSecret);
	//To have access to all the community tables 
	yql.setQueryParameter({
		env: 'store://datatables.org/alltableswithkeys'
	});

	yql.execute(query, function(err,response) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {

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

exports.blockUpdate = function() {

	var quotes = Quote.find().execute(),
		res = null; //How to create a res object? TODO

	for (var i = quotes.length - 1; i >= 0; i--) {
		var quote = quotes[i];

		exports.yahooQuote(quote.yahooSymbol,res);
	}

	
};
