'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');

const TXNTYPES = [{'type': 'Buy', 'ITrade': 'BUY'},
				    {'type': 'Sell', 'ITrade': 'SELL'},
				    {'type': 'Dividend', 'ITrade': 'DIVIDEND'},
				    {'type': 'Drip', 'ITrade': 'Drip'}]; 

exports.getTypes = function() {
    return TXNTYPES;
};

/**
 * Get type by ITradeType 
 */
exports.getByITrade = function(iTradeCode) {

	var iTradeType = _.filter(TXNTYPES, function(i) {
		if (i.ITrade === iTradeCode) {
			return i;
		}
	});
	
	var returnVal = '';
	if (iTradeType !== undefined && iTradeType.length > 0) {
		returnVal = iTradeType[0].type;
	}

	return returnVal;
};
