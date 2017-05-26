'use strict';

/**
 * Module dependencies.
 */
let should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Stockposition = mongoose.model('Stockposition');

/**
 * Globals
 */
let user, stockposition;
