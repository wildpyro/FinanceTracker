'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * A Validation function for yahoo OAuth strategy properties
 */
var validateLocalStrategyProperty = function(property) {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * Fundamentals Schema
 */
var FundamentalsSchema = new Schema({
	
	Symbol: {
		type: String
	},
	YahooSymbol: {
		type: String
	},	
	lastUpdated: {
		type: Date,
		default: Date.now
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	EarningsShare: {
		type: Number
	},
	EPSEstimateCurrentYear: {
		type: Number
	},
	EPSEstimateNextQuarter: {
		type: Number
	},
	EPSEstimateNextYear: {
		type: Number
	},
	PriceSales: {
		type: Number
	},
	PriceBook: {
		type: Number
	},
	ExDividendDate: {
		type: String
	},
	DividendPayDate: {
		type: String
	},	
	PERatio: {
		type: Number
	}

	
});

mongoose.model('Fundamentals', FundamentalsSchema);