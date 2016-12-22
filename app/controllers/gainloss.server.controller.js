'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	GainLoss = mongoose.model('GainLoss'),
	_ = require('lodash');

/**
 * Create a GainLoss
 */
exports.create = function(req, res) {
	var gainLoss = new GainLoss(req.body);
	gainLoss.user = req.user;

	gainLoss.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} 
		else {
			res.jsonp(gainLoss);
		}	
	});
};

/**
 * Show the current GainLoss
 */
exports.read = function(req, res) {
	res.jsonp(req.gainLoss);
};

/**
 * Update a GainLoss
 */
exports.update = function(req, res) {
	var gainLoss = req.gainLoss ;

	gainLoss = _.extend(gainLoss , req.body);

	gainLoss.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gainLoss);
		}
	});
};

/**
 * Delete an GainLoss
 */
exports.delete = function(req, res) {
	var gainLoss = req.gainLoss;

	gainLoss.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			if (err) {return res.status(400).send({message: errorHandler.getErrorMessage(err)});}

			res.jsonp(gainLoss);
		}
	});
};

/**
 * List of GainLoss
 */
exports.list = function(req, res) {

	var query = GainLoss.find(),
		pagination = {
			start: ((req.query.page || 1) - 1) * (req.query.count || 50),
			count: req.query.count || 50
		};

	//Filter
	if (req.query.filter && !_.isEmpty(req.query.filter) && req.query.filter.length > 2) {

		var filter = JSON.parse(req.query.filter);

		if (filter.settlementDate) {
			query.where('settlementDate').in(JSON.parse(req.query.filter).date);
		}

		if (filter.accountType) {
			query.where('accountType').in(JSON.parse(req.query.filter).accountType);
		}

		if (filter.symbol) {
			query.where('symbol').in(JSON.parse(req.query.filter).symbol.toUpperCase().split(','));
		}
	}

	//Sort
	if (req.query.sort && req.query.sort.length > 2) {
		var sortKey = JSON.parse(req.query.sort).predicate,
			direction = JSON.parse(req.query.sort).reverse ? 'desc' : 'asc';
	
		query.sort({[sortKey] : direction});
	}
	else {
		query.sort({date: 'asc'});
	}

	query.page(pagination, function(err, gainLosss){
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gainLosss);
		}
	});
};

/**
 * GainLoss middleware
 */
exports.gainLossByID = function(req, res, next, id) {
	GainLoss.findById(id).populate('user', 'displayName').exec(function(err, gainLoss) {
		if (err) return next(err);
		if (! gainLoss) return next(new Error('Failed to load GainLoss ' + id));
		req.gainLoss = gainLoss ;
		next();
	});
};

/**
 * GainLoss authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.user.id !== req.user.id) {
		return res.status(403).send({message: 'User is not authorized'});
	}
	next();
};
