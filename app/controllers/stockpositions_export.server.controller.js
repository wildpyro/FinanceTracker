'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	//Stockposition_Archive = mongoose.model('Stockposition_Archive'),
	Stockposition = require('./stockpositions.server.controller'),
	_ = require('lodash');

/** 
 * Export the data from stock positions to a csv
 */
 exports.exportData = function(req, res) {
 	if (req.user.id) {
 		//For now just select everything. Currently authorization isn't supported. 
 		Stockposition.find().exec(function(err) {
 			
 			if (err) {
				return res.status(400).send({message: errorHandler.getErrorMessage(err)});
			} else {
				return res.status(400).send({message: 'File is located: '});
			}			
 		});

 	}
 	else {
		return res.status(403).send('User is not authorized');
 	}
 };

/**
 * Stockpositions_Export authorization middleware
 */
 /*
exports.hasAuthorization = function(req, res, next) {
	if (req.stockpositions.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};*/