'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Txn = mongoose.model('Txn'),
	_ = require('lodash');

/**
 * Create a Txn
 */
exports.create = function(req, res) {
	var txn = new Txn(req.body);
	txn.user = req.user;

	txn.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} 
		else {
			res.jsonp(txn);
		}	
	});
};

/**
 * Show the current Txn
 */
exports.read = function(req, res) {
	res.jsonp(req.txn);
};

/**
 * Update a Txn
 */
exports.update = function(req, res) {
	var txn = req.txn ;

	txn = _.extend(txn , req.body);

	txn.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(txn);
		}
	});
};

/**
 * Delete an Txn
 */
exports.delete = function(req, res) {
	var txn = req.txn;

	txn.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			if (err) {return res.status(400).send({message: errorHandler.getErrorMessage(err)});}

			res.jsonp(txn);
		}
	});
};

/**
 * List of Txn
 */
exports.list = function(req, res) {

	var sort;
	var sortObject = {};
	var count = req.query.count || 20;
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

	Txn
		.find()
		.filter(filter)
		.order(sort)
		.page(pagination, function(err, txns){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(txns);
			}
		});
};

/**
 * Txn middleware
 */
exports.txnByID = function(req, res, next, id) {
	Txn.findById(id).populate('user', 'displayName').exec(function(err, txn) {
		if (err) return next(err);
		if (! txn) return next(new Error('Failed to load Txn ' + id));
		req.txn = txn ;
		next();
	});
};

/**
 * Txn authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.user.id !== req.user.id) {
		return res.status(403).send({message: 'User is not authorized'});
	}
	next();
};