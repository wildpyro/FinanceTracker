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
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	stockpositions: {
		type: []
	}
});

mongoose.model('Stockposition_Archive', Stockposition_ArchiveSchema);
