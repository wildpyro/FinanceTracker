'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	_ = require('lodash'),
	Schema = mongoose.Schema;

/**
 * Income Schema
 */
var IncomeSchema = new Schema({
	settlementDate: {
		type: Date,
		required: 'Please fill in a date'
	},
	description: {
		type: String,
		default: '',
		required: 'Please fill in a description',
		trim: true
	},	
	symbol: {
		type: String,
		default: '',
		required: 'Please fill in a symbol',
		uppercase: true,
		trim: true
	},    
	price: {
		type: Number,
		default: 0,
		required: 'Please fill in a price'
	},
	shares: {
		type: Number,
		default: 0,
		required: 'Please fill in the number of shares'
	},
	exchangeRate: {
		type: Number,
		default: 1,
		required: 'Please fill in the exchange rate'
	},
    tradeCurrency: {
		type: String,
		default: 'CAD',
		required: 'Please fill in the currency'
	},
	settle: {
		type: Number,
		default: 0,
		required: 'Please fill in the settle amount'
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

mongoose.model('Income', IncomeSchema);
