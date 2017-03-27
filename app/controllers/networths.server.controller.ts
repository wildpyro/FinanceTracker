'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	NETWORTH = mongoose.model('networth'),
	_ = require('lodash');

/**
 * Create a NETWORTH
 */
exports.create = function(req, res) {
	var networth = new NETWORTH(req.body);
	networth.user = req.user;

	networth.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(networth);
		}
	});
};

/**
 * Show the current NETWORTH
 */
exports.read = function(req, res) {
	res.jsonp(req.networth);
};

/**
 * Update a NETWORTH
 */
exports.update = function(req, res) {
	var networth = req.networth ;

	networth = _.extend(networth , req.body);

	networth.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(networth);
		}
	});
};

/**
 * Delete an NETWORTH
 */
exports.delete = function(req, res) {
	var networth = req.networth ;

	networth.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(networth);
		}
	});
};

/**
 * List of NETWORTHs
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
	} else {
		sortObject.desc = '_id';
	}

	sort = {
		sort: sortObject
	};

	NETWORTH
		.find()
		.filter(filter)
		.order(sort)
		.page(pagination, function(err, networths){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(networths);
			}
		});
};

/**
 * NETWORTH middleware
 */
exports.networthByID = function(req, res, next, id) {
	NETWORTH.findById(id).populate('user', 'displayName').exec(function(err, networth) {
		if (err) {
			return next(err);
		}

		if (! networth) {
			return next(new Error('Failed to load NETWORTH ' + id));
		}

		req.networth = networth ;
		next();
	});
};

/**
 * NETWORTH authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.networth.user.id !== req.user.id) {
		return res.status(403).send({message: 'User is not authorized'});
	}
	next();
};
