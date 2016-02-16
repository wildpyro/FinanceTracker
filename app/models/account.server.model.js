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
	
	name: {
		type: String,
		default: '',
		required: 'Please fill Account name',
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
		type: [{
			type: Number,
			enum: [0,1,2,3]
		}],
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
	stockPositions: [{type: Schema.Types.ObjectId, ref: 'Stockposition'}]
});

mongoose.model('Account', AccountSchema);