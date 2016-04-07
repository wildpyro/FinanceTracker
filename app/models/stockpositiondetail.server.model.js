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
	name: {
		type: String,
		default: '',
		required: 'Please fill Stockpositiondetail name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Stockpositiondetail', StockpositiondetailSchema);