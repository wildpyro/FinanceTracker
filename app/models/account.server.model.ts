'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * Account Schema
 */
var AccountSchema = new Schema({
	description: {
		type: String,
		default: '',
		required: 'Please fill in an account description',
		trim: true
	},
	accountNo: {
		type: String,
		default: '',
		length: 8,
		required: [validateLocalStrategyProperty, 'Please fill the account no'],
		trim: true
	},
	accountType: {
		type: String, enum: ['open', 'rsp', 'tfsa', 'resp', 'joint'],
		required: 'Please select an account type',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	stockPositions: [{type: Schema.Types.ObjectId, ref: 'Stockposition'}],
	marketValue: {
		type: Number
	}
});

mongoose.model('Account', AccountSchema);