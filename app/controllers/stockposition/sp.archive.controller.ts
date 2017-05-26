'use strict';
/**
 * Module dependencies.
 */
let mongoose = require('mongoose'),
	_ = require('lodash'),
	errorHandler = require('../errors.server.controller'),
	Stockposition = require('../stockpositions.server.controller'),
	SpTotals = require('./sp.calcs.server.controller'),
	Stockposition_Archive = mongoose.model('Stockposition_Archive'),
	StockpositionModel = mongoose.model('Stockposition'),
	months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];

function archive(req, res, stockpositions) {

	let month = req.body.month.toLowerCase(),
		year = req.body.year;

	if (month === undefined || month.length !== 3 || months.indexOf(month) === -1) {
		return res.status(400).send({message: 'You have not selected a valid month'}); 
	}

	if (year === undefined || typeof year === 'number' || year.length > 4 || year.length < 4 || year < 2000) {
		return res.status(400).send({message: 'You have not selected a valid year'}); 	
	}

	let stockpositions_archive = new Stockposition_Archive();
	
	let addDate = Date.parse(month + ' 1, ' + year);

	stockpositions_archive.month = month;
	stockpositions_archive.year = year;
	stockpositions_archive.date = addDate; 
	stockpositions_archive.user = req.user._id;
	stockpositions_archive.stockpositions = stockpositions;

	SpTotals.calcTotal(req.user, function(totals) {

		stockpositions_archive.market = totals.market;
		stockpositions_archive.book = totals.book;
		stockpositions_archive.gainLoss = totals.gainLoss;
		stockpositions_archive.gainLossPct = totals.gainLossPct; 
		
		stockpositions_archive.save(function(err) {
			if (err) {
				return res.status(400).send({message: errorHandler.getErrorMessage(err)});
			} 
			else {
				return res.status(200).send({message: 'Backup successful for:' + month + ' ' + year});
			}						
		});
	});
}

/** 
 * Pull the totals from the monthly archives  
 */
exports.listArchive = function(req, res) {

 	let query = Stockposition_Archive.find();

	query.select('-stockpositions'); //Exclude the stock positions as we only want the totals 
	query.where({'user' : req.user._id});
	query.sort({addDate: 'asc', archiveDate: 'asc'});
	query.exec(function(err, archive) {
		if (err) {
			return res.status(400).send({message: errorHandler.getErrorMessage(err)});
		} 
		else {
 			res.jsonp(archive);
		}			
	});
};

/**
 * Not currently used
 * Going to be a historic total of a for given symbol. Probably used on the stock position detail screen  
 */
exports.listSymbolHistory = function(req, res) {

 	let query = Stockposition_Archive.find();

	query.select('-stockpositions'); //Exclude the stock positions as we only want the totals 
	query.where({'user' : req.user._id});
	query.sort({addDate: 'asc', archiveDate: 'asc'});
	query.exec(function(err, archive) {
		if (err) {
			return res.status(400).send({message: errorHandler.getErrorMessage(err)});
		} 
		else {
 			res.jsonp(archive);
		}			
	});
};


/** 
 * Move the monthly reporting to its own table 
 */
exports.monthlyReporting = function(req, res) {

 	let query = StockpositionModel.find();
	//Commented out until I fix the user links query.where({'user' : req.user._id});
	query.exec(function(err, stockpositions) {
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

	let query = Stockposition_Archive.find;

	//Figure out what to do here. How to select the max
	query.sort({});
	query.limit(1);

	query.exec(function(err, archive) {
		for (let i = archive.length - 1; i >= 0; i--) {
			let collection = archive[i].stockpositions;

			for (let ii = collection.length - 1; ii >= 0; ii--) {
				let stockposition = new StockpositionModel(collection[ii]);
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
