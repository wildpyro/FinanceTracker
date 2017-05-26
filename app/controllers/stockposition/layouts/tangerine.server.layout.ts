'use strict';
/**
 * Module dependencies.
 */
let mongoose = require('mongoose'),
	_ = require('lodash'),
	errorHandler = require('../../errors.server.controller'),
	Stockposition = require('../../stockpositions.server.controller'),
	StockpositionModel = mongoose.model('Stockposition');