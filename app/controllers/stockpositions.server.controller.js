'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Stockposition = mongoose.model('Stockposition'),
	Account = mongoose.model('Account'),
	_ = require('lodash');


/**
* Update references either add or delete
**/
var updateReferences = function(action, stockposition) {

	Account.findOne({'accountType': stockposition.accountType[0]}, function(err, account) {
		if (err) {return err;}	
		else {
			if (action === 'add') {
				if (account.stockPositions === undefined || account.stockPositions === null) {
					account.stockpositions = [];
				}

				account.stockPositions.push(stockposition);
			}
			else if (action === 'remove')
			{
				if (account.stockPositions !== undefined && account.stockPositions !== null) {
					account.stockPositions.pop(stockposition);	
				}
			}

			account.save(function(err) {
				if (err) {return err;}
				else {
					return null;
				}
			});
		}
	});
}; 

/**
 * Create a Stockposition
 */
exports.create = function(req, res) {
	var stockposition = new Stockposition(req.body);
	stockposition.user = req.user;

	stockposition.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} 
		else {
			err = updateReferences('add', stockposition);
			
			if (err) {return res.status(400).send({message: errorHandler.getErrorMessage(err)});}

			res.jsonp(stockposition);
		}	
	});
};

/**
 * Show the current Stockposition
 */
exports.read = function(req, res) {
	res.jsonp(req.stockposition);
};


/**
 * Update a Stockposition
 */
exports.update = function(req, res) {
	var stockposition = req.stockposition ;

	stockposition = _.extend(stockposition , req.body);

	stockposition.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(stockposition);
		}
	});
};

/**
 * Delete an Stockposition
 */
exports.delete = function(req, res) {
	var stockposition = req.stockposition ;

	stockposition.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			//remove the reference after? What happens when this fails? 
			updateReferences('remove', stockposition);

			if (err) {return res.status(400).send({message: errorHandler.getErrorMessage(err)});}

			res.jsonp(stockposition);
		}
	});
};

/**
 * List of Stockpositions
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

	Stockposition
		.find()
		.filter(filter)
		.order(sort)
		.page(pagination, function(err, stockpositions){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(stockpositions);
			}
		});
};

/**
 * List of Stockpositions
 */
exports.listByAccountType = function(req, res) {

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

	console.log(req.params.accountType);

	Stockposition
		.where('accountType').in([req.params.accountType])
		.order(sort)
		.page(pagination, function(err, stockpositions){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(stockpositions);
			}
		});		
};

/**
 * Stockposition middleware
 */
exports.stockpositionByID = function(req, res, next, id) {
	Stockposition.findById(id).populate('user', 'displayName').exec(function(err, stockposition) {
		if (err) return next(err);
		if (! stockposition) return next(new Error('Failed to load Stockposition ' + id));
		req.stockposition = stockposition ;
		next();
	});
};

/**
 * Stockposition authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.stockposition.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};