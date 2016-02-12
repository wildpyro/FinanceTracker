'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Stockposition Schema
 */
var StockpositionSchema = new Schema({
	accountType: {
		type: [{
			type: Number,
			enum: [0,1,2,3]
		}],
		default: '0',
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
	market: {
		type: Number,
		default: 0,
		required: 'Please fill in a market value'
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

mongoose.model('Stockposition', StockpositionSchema);
