'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Stockposition Schema
 */
var TxnSchema = new Schema({
	date: {
		type: Date,
		required: 'Please fill in a date'
	},
	accountType: {
		type: [{
			type: Number,
			enum: [0,1,2,3]
		}],
		required: 'Please select an account type',
		trim: true
	},	
	symbol: {
		type: String,
		default: '',
		required: 'Please fill in a symbol',
		uppercase: true,
		trim: true
	},
	type: {
		type: [{
			type: String,
			enum: ['Buy','Sell','Dividend','Drip']
		}],
		required: 'Please select a transaction type',
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
	commission: {
		type: Number,
		default: 0,
		required: 'Please fill in the commission amount'
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

mongoose.model('Txn', TxnSchema);
