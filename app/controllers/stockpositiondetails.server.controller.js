'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Stockpositiondetail = mongoose.model('Stockpositiondetail'),
	_ = require('lodash');

/**
 * Create a Stockpositiondetail
 */
exports.create = function(req, res) {
	var stockpositiondetail = new Stockpositiondetail(req.body);
	stockpositiondetail.user = req.user;

	stockpositiondetail.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(stockpositiondetail);
		}
	});
};

/**
 * Show the current Stockpositiondetail
 */
exports.read = function(req, res) {
	res.jsonp(req.stockpositiondetail);
};

/**
 * Update a Stockpositiondetail
 */
exports.update = function(req, res) {
	var stockpositiondetail = req.stockpositiondetail ;

	stockpositiondetail = _.extend(stockpositiondetail , req.body);

	stockpositiondetail.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(stockpositiondetail);
		}
	});
};

/**
 * Delete an Stockpositiondetail
 */
exports.delete = function(req, res) {
	var stockpositiondetail = req.stockpositiondetail ;

	stockpositiondetail.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(stockpositiondetail);
		}
	});
};

/**
 * List of Stockpositiondetails
 */
exports.list = function(req, res) {

	var sort;
	var sortObject = {};
	var count = req.query.count || 5;
	var page = req.query.page || 1;


	var filter = {
		filters : {
			mandatory : {
				contains: req.query.filter
			}
		}
	};

	var pagination = {
		start: (page - 1) * count,
		count: count
	};

	if (req.query.sorting) {
		var sortKey = Object.keys(req.query.sorting)[0];
		var sortValue = req.query.sorting[sortKey];
		sortObject[sortValue] = sortKey;
	}
	else {
		sortObject.desc = '_id';
	}

	sort = {
		sort: sortObject
	};


	Stockpositiondetail
		.find()
		.filter(filter)
		.order(sort)
		.page(pagination, function(err, stockpositiondetails){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(stockpositiondetails);
			}
		});

};

/**
 * Stockpositiondetail middleware
 */
exports.stockpositiondetailByID = function(req, res, next, id) {
	Stockpositiondetail.findById(id).populate('user', 'displayName').exec(function(err, stockpositiondetail) {
		if (err) return next(err);
		if (! stockpositiondetail) return next(new Error('Failed to load Stockpositiondetail ' + id));
		req.stockpositiondetail = stockpositiondetail ;
		next();
	});
};

/**
 * Stockpositiondetail authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.stockpositiondetail.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
