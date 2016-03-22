'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * StockPositionDetail Schema
 */
var StockPositionDetailSchema = new Schema({
	symbol: {
		type: String,
		default: '',
		uppercase: true,
		trim: true
	},
	price: {
		type: Number,
		default: 0
	},
	shares: {
		type: Number,
		default: 0
	},
	market: {
		type: Number,
		default: 0
	},
	description: {
		type: String,
		default: '',
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

mongoose.model('StockPositionDetail', StockPositionDetailSchema);
