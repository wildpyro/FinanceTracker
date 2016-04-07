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
	
	name: {
		type: String,
		default: '',
		required: 'Please fill Account name',
		trim: true
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
	stockPositions: [{type: Schema.Types.ObjectId, ref: 'Stockposition'}]
});

mongoose.model('QuoteSchema', QuoteSchema);