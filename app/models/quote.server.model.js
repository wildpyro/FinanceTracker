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
 * Quote Schema
 */
var QuoteSchema = new Schema({
	
	lastUpdated: {
		type: Date,
		default: Date.now
	},
	created: {
		type: Date,
		default: Date.now
	},
	Symbol: {
		type: String
	},
	Change: {
		type: String
	},
	DaysLow: {
		type: Number
	},
	DaysHigh: {
		type: Number
	},
	YearLow: {
		type: Number
	},
	YeahHigh: {
		type: Number
	},
	DaysRange: {
		type: String
	},
	Name: {
		type: String
	},
	Volume: {
		type: Number
	},
	StockExchange: {
		type: String
	},
	YahooSymbol: {
		type: String
	}
});

mongoose.model('Quote', QuoteSchema);