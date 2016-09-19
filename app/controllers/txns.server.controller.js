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

	var query = Txn.find(),
		pagination = {
			start: ((req.query.page || 1) - 1) * (req.query.count || 50),
			count: req.query.count || 50
		};

	//Filter
	if (req.query.filter && !_.isEmpty(req.query.filter) && req.query.filter.length > 2) {
		console.log(req.query.filter);
		query.where('symbol').in(JSON.parse(req.query.filter).symbol.toUpperCase().split(','));
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

	query.page(pagination, function(err, txns){
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