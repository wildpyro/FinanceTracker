'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	//StockpositionSchema = mongoose.model('Stockposition'),
	Schema = mongoose.Schema;

/**
 * Stockposition Schema
 */
var Stockposition_ArchiveSchema = new Schema({
	archiveDate: {
		type: Date,
		default: Date.now
	},
	year: {
		type: 'Number'
	},
	month: {
		type: 'String'
	},
	date: {
		type: 'Date'
	},	
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	market: {
		type: Number,
		default: 0
	},	
	book: {
		type: Number,
		default: 0
	},
	gainLoss: {
		type: Number,
		default: 0
	},
	gainLossPct: {
		type: Number,
		default: 0
	},	
	stockpositions: {
		type: []
	}
});


mongoose.model('Stockposition_Archive', Stockposition_ArchiveSchema);
