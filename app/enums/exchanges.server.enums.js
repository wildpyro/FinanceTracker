'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');

const EXCHANGES = [{'exchange': 'TSX', 'yahoo': 'TO'},
                   {'exchange': 'TSX-V', 'yahoo': 'V'},
                   {'exchange': 'NYSE', 'yahoo': ''}]; 

exports.getExchanges = function() {
    return EXCHANGES;
};

/**
 * Get exchange by yahoo code 
 */
exports.getByYahooCode = function(yahooCode) {

	var foundExchange = _.filter(EXCHANGES, function(i) {
		if (i.yahoo === yahooCode) {
			return i;
		}
	});
	
	var returnVal = '';
	if (foundExchange !== undefined && foundExchange.length > 0) {
		returnVal = foundExchange[0].type;
	}

	return returnVal;
};

exports.getByExchangeCode = function(exchangeCode) {

	var foundExchange = _.filter(EXCHANGES, function(i) {
		if (i.exchange === exchangeCode) {
			return i;
		}
	});
	
	var returnVal = '';
	if (foundExchange !== undefined && foundExchange.length > 0) {
		returnVal = foundExchange[0].type;
	}

	return returnVal;
};
