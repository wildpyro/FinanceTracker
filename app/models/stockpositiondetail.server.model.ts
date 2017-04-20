'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Stockpositiondetail Schema
 */
var StockpositiondetailSchema = new Schema({
	symbol: {
		type: String
	},
	quote: [{
		type: Schema.Types.ObjectId,
		ref: 'Quote'
	}],
	fundamentals: [{
		type: Schema.Types.ObjectId,
		ref: 'Fundamentals'
	}],
	performance: [{
		type: Schema.Types.ObjectId,
		ref: 'Performance'
	}]
});

mongoose.model('Stockpositiondetail', StockpositiondetailSchema);
