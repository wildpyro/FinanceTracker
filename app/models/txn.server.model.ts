'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	_ = require('lodash'),
	TxnTypes = require('../enums/txntypes.server.enums'),
	Schema = mongoose.Schema;

/**
 * Txn Schema
 */
var TxnSchema = new Schema({
	settlementDate: {
		type: Date,
		required: 'Please fill in a date'
	},
	accountType: {
		type: String, enum: ['open','rsp','tfsa','resp','joint'],
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
		type: String, enum: _.map(TxnTypes.TXNTYPES, 'type'),
		required: 'Please select a transaction type',
		trim: true
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

mongoose.model('Txn', TxnSchema);
