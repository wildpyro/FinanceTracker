'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Performance = mongoose.model('Performance'),
	Core = require('./core.server.controller'),
	_ = require('lodash'),
	yql = require('yql-node').formatAsJSON().withOAuth('dj0yJmk9UEZ2dVR0MW9DdGRzJmQ9WVdrOVVHSjNXVkJ3Tm1VbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD1kYg--','333e37c4369865acb17233cfd83a12b83ee8c710');

function yahooPerformance(symbol, res) {

	// TSX is TO in YQL. Make this dynamic once I support other exchanges 
	var exchange = 'TO';
	var query = 'select * from yahoo.finance.fundamental where symbol in ("'.concat(symbol).concat('.').concat(exchange).concat('");');

	yql.execute(query, function(err,res) {

		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			console.log(JSON.parse(res).query.results);
		}
	});
}

function localSearch(symbol, res) {
	console.log('running locally.');
}

/**
* Fetch a stock performance by symbol
*/
exports.search = function(symbol, res)
{
	if (symbol !== null && symbol !== undefined && symbol !== '') {
		Core.checkInternet(function(isConnected) {
		    if (isConnected) {
		    	yahooPerformance(symbol, res);
		    } else {
		        //Not connected, so try and search the quote db for info. 
		        localSearch();
		    }
		});
	}
	else {
		return res.status(400).send({message: new Error('You must select a symbol')});		
	}
};

/**
 * Performance middleware
 */
exports.fetchBySymbol = function(req, res, next, id) {
	Performance.findById(id).populate('user', 'displayName').exec(function(err, perf) {
		if (err) return next(err);
		if (! perf) return next(new Error('Failed to load Perf ' + id));
		req.perf = perf;
		next();
	});
};