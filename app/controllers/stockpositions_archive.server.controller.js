'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Stockposition_Archive = mongoose.model('Stockposition_Archive'),
	StockpositionModel = mongoose.model('Stockposition'),
	Stockposition = require('./stockpositions.server.controller'),
	_ = require('lodash'),
	months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];

function createArchive(stockpositions_archive, res) {
	stockpositions_archive.save(function(err) {
		if (err) {
			return res.status(400).send({message: errorHandler.getErrorMessage(err)});
		} 
		else {
			return;
		}	
	});
}

function archive(req, res, stockpositions) {

	var month = req.body.month.toLowerCase(),
		year = req.body.year;

	if (month === undefined || month.length !== 3 || months.indexOf(month) === -1) {
		return res.status(400).send({message: 'You have not selected a valid month'}); 
	}

	if (year === undefined || typeof year === 'number' || year.length > 4 || year.length < 4 || year < 2000) {
		return res.status(400).send({message: 'You have not selected a valid year'}); 	
	}

	var stockpositions_archive = new Stockposition_Archive();
	
	stockpositions_archive.month = month;
	stockpositions_archive.year = year;
	stockpositions_archive.user = req.user._id;
	stockpositions_archive.stockpositions = stockpositions;

	stockpositions_archive.save(function(err) {
		if (err) {
			return res.status(400).send({message: errorHandler.getErrorMessage(err)});
		} 
		else {
			return res.status(200).send({message: 'Backup successful for:' + month + ' ' + year});
		}						
	});
}

/** 
 * Move the monthly reporting to its own table 
 */
 exports.monthlyReporting = function(req, res) {
 	
 	StockpositionModel.find().exec(function(err, stockpositions) {

 		if (err) {
			return res.status(400).send({message: errorHandler.getErrorMessage(err)});
		} 
		else if (stockpositions === undefined || stockpositions === null) {
			return res.status(400).send({message: 'No stock positions were found'});
		}
		else {
 			archive(req, res, stockpositions);
		}			
	});
 };

/** 
 * Restore the data back.  
 */
exports.restoreStockPositionsFromArchive = function(req, res) {

	var query = Stockposition_Archive.find;

	//Figure out what to do here. How to select the max 
	query.sort({}); 
	query.limit(1);

	query.exec(function(err, archive) {
		for (var i = archive.length - 1; i >= 0; i--) {
			var collection = archive[i].stockpositions; 

			for (var ii = collection.length - 1; ii >= 0; ii--) {
				var stockposition = new StockpositionModel(collection[ii]);
				stockposition.save();
			}

			if (err) {
				return res.status(400).send({message: errorHandler.getErrorMessage(err)});
			} 
			else {
				return res.status(200).send({message: 'Restore complete'});
			}							 
		}
	});
}; 