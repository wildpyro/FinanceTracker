'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Stockposition = mongoose.model('Stockposition');

/**
 * Globals
 */
var user, stockposition;
