'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Account = mongoose.model('Account'),
	_ = require('lodash');

/**
 * Create a Account
 */
exports.create = function(req, res) {
	var account = new Account(req.body);
	account.user = req.user;

	account.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(account);
		}
	});
};

/**
 * Show the current Account
 */
exports.read = function(req, res) {
	res.jsonp(req.account);
};

/**
 * Update a Account
 */
exports.update = function(req, res) {
	var account = req.account ;

	account = _.extend(account , req.body);

	account.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(account);
		}
	});
};

/**
 * Delete an Account
 */
exports.delete = function(req, res) {
	var account = req.account ;

	account.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(account);
		}
	});
};

/**
 * List of Accounts
 */
exports.list = function(req, res) {

	var sort;
	var sortObject = {};
	var count = req.query.count || 5;
	var page = req.query.page || 1;

	console.log('got here');


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


	Account
		.find()
		.filter(filter)
		.order(sort)
		.page(pagination, function(err, accounts){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(accounts);
			}
		});

};

/**
 * Account middleware
 */
exports.accountByID = function(req, res, next, id) {
	Account.findById(id).populate('user', 'displayName').exec(function(err, account) {
		if (err) return next(err);
		if (! account) return next(new Error('Failed to load Account ' + id));
		req.account = account ;
		next();
	});
};

/**
 * Account authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.account.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};