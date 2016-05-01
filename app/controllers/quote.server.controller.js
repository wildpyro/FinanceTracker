'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	passport = require('passport'),
	errorHandler = require('./errors.server.controller'),
	Quote = mongoose.model('Quote'),
	Core = require('./core.server.controller'),
	_ = require('lodash'),
	yql = require('yql-node');

/**
 * Create a Quote
 */
function create(req, res) {
	console.log('Creating a new one', req);

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
	console.log('Updating an existing', req);
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

function yahooQuote(symbol, res) {

	// TSX is TO in YQL. Make this dynamic once I support other exchanges 
	var exchange = 'TO';
	var yahooSymbol = symbol.concat('.', exchange);
	var query = 'select * from yahoo.finance.quote where symbol in ("'.concat(yahooSymbol).concat('");');

	yql.formatAsJSON().withOAuth('','');
	yql.execute(query, true, function(err,res) {

		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {

			var query = {'Symbol': symbol},
				options = {'upsert': true, 'new': true, 'setDefaultOnInsert': true},
				quoteResponse = JSON.parse(res).query.results.quote;

			quoteResponse.Symbol = symbol;
			quoteResponse.YahooSymbol = yahooSymbol;
			quoteResponse.lastUpdate = Date.now;

			Quote.findOneAndUpdate(query, quoteResponse, options, function (err, quote) {
				if (err) {
  					return res.status(400).send({message: errorHandler.getErrorMessage(err)});
  				}
  				else {
					res.jsonp(quote);					
				}
			});
		}
	});
}

/**
* Local Search 
* when no connection is available, try and see if we have anything stored
**/
function localSearch(symbol, res) {
	Quote.findOne({'Symbol': symbol}, function (err, quote) {
		if (err) {
			return res.status(400).send({message: errorHandler.getErrorMessage(err)});
		}
		else {
			res.jsonp(quote);		
		}
	});	
}

/**
* Search 
* Fetch a stock quote by symbol 
*/
exports.search = function(symbol, res)
{
	if (symbol !== null && symbol !== undefined && symbol !== '') {
		Core.checkInternet(function(isConnected) {
		    if (isConnected) {
		    	yahooQuote(symbol, res);
		    } else {
		        //Not connected, so try and search the quote db for info. 
		        localSearch(symbol, res);
		    }
		});
	}
	else {
		return res.status(400).send({message: new Error('You must select a symbol')});		
	}

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