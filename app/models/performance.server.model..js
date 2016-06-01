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
 * Performance Schema
 */
var PerformanceSchema = new Schema({
	
	Symbol: {
		type: String
	},
	YahooSymbol: {
		type: String
	},
	lastUpdated: {
		type: Date
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	FiftydayMovingAverage: {
		type: Number
	},
	TwoHundreddayMovingAverage: {
		type: Number
	},
	PercentChangeFromTwoHundreddayMovingAverage: {
		type: String
	},
	PercentChangeFromFiftydayMovingAverage: {
		type: String
	}
});

mongoose.model('Performance', PerformanceSchema);