'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Quote = mongoose.model('Quote'),
	_ = require('lodash'),
	yql = require('yql-node').formatAsJSON().withOAuth('dj0yJmk9UEZ2dVR0MW9DdGRzJmQ9WVdrOVVHSjNXVkJ3Tm1VbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD1kYg--','333e37c4369865acb17233cfd83a12b83ee8c710');
/*	
	var query = 'select * from yahoo.finance.quote where symbol in ("YHOO","AAPL","GOOG","RY.TO")';

	yql.execute(query, true, function(error,response) {
	    console.log(JSON.parse(response).query.results);
	  });	
	//Sample yahoo query select * from yahoo.finance.quote where symbol in ("RY.TO")
*/

/**
* Fetch a stock quote - Not sure if this should be one off or grab all? 
*/
exports.search = function(req, res)
{
	var symbol = req.symbol;

	if (symbol !== null && symbol !== undefined && symbol !== '') {

		var query = 'select * from yahoo.finance.quote where symbol in ('.concat(symbol).concat(')');

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
	else {
		return res.status(400).send({message: new Error('You must select a symbol')});		
	}

};

/**
 * Quote middleware
 */
exports.stockpositionByID = function(req, res, next, id) {
	Quote.findById(id).populate('user', 'displayName').exec(function(err, quote) {
		if (err) return next(err);
		if (! quote) return next(new Error('Failed to load Quote ' + id));
		req.quote = quote;
		next();
	});
};