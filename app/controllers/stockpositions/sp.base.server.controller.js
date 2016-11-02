'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	_ = require('lodash'),
	errorHandler = require('../errors.server.controller'),
	quote = require('../quote.server.controller'),
	Quote = mongoose.model('Quote'),
	Stockposition = mongoose.model('Stockposition'),
	Account = mongoose.model('Account');

/**
* Update references either add, delete or check 
**/
var updateReferences = function(action, stockposition) {
	Account.findOne({'accountType': stockposition.accountType}, function(err, account) {
		if (err) {return err;}	
		else {
			if (account !== undefined) {
				if (action === 'add') {
					if (account.stockPositions === undefined || account.stockPositions === null) {
						account.stockpositions = [];
					}

					account.stockPositions.push(stockposition);
				}
				else if (action === 'remove') {
					if (account.stockPositions !== undefined && account.stockPositions !== null) {
						account.stockPositions.pop(stockposition);	
					}
				}
				else if (action === 'check') {
					if (account.stockPositions !== undefined && account.stockPositions !== null) {
						if (!account.stockPositions.includes(stockposition._id)) {
							account.stockPositions.push(stockposition);
						}
						//Look through and make sure all the references are correct. 
						else {
							Account.find({}, function(err, accounts) {
								accounts.forEach(function(account) {
									account.stockpositions.forEach(function(stockposition) {
										//console.log(stockposition);
									}, this);
								}, this);
							}); 
						}
					}

				}

				account.save(function(err) {
					if (err) {return err;}
					else {
						return null;
					}
				});
			}
		}
	});
}; 

/** 
 * Check to ensure we aren't adding duplicate symbols to the same accounttype'
 */
exports.checkDuplicates = function(req, res, next) {
	var stockposition = new Stockposition(req.body);
	Stockposition.findOne({'accountType': stockposition.accountType, 'symbol': stockposition.symbol}, function(err, duplicate) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		else {
			if (duplicate !== null && duplicate !== undefined) {
				return res.status(400).send({message: 'Stock already exists for the account'});
			}
		}	

		next();	
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
exports.readBase = function(req, res) {
	res.jsonp(req.stockposition);
};

/**
 * Update a Stockposition
 */
exports.update = function(req, res, next) {
	var stockposition = req.stockposition;

	stockposition = _.extend(stockposition , req.body);

	stockposition.save(function(err) {
		if (err) {
			return res.status(400).send({message: errorHandler.getErrorMessage(err)});
		} 
		else {
			updateReferences('check', stockposition);

			res.jsonp(stockposition);
		}

		next();
	});
};

/**
 * Helper to update all prices in one shot
 */
exports.updatePrice = function(req, res, next) {
	var symbolToSearch = req.stockposition.symbol,
		accountType = req.stockposition.accountType,
		price = req.stockposition.price,
		filter = ({symbol: symbolToSearch });
		
	Stockposition.find(filter, function(err, results) {
		if (err) {
			return res.status(400).send({message: errorHandler.getErrorMessage(err)});
		}
		else {
			results.forEach(function(result) {
				result.price = price;
				result.market = Number(price * result.shares).toFixed(2);
				result.save(function(err) {
					if (err) {
						return res.status(400).send({message: errorHandler.getErrorMessage(err)});
					}
				});
			}, this);
		}
	});

};

/**
 * Delete an Stockposition
 */
exports.deleteBase = function(req, res) {
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
exports.listBase = function(req, res) {

	var query = Stockposition.find(),
		pagination = {
			start: ((req.query.page || 1) - 1) * (req.query.count || 50),
			count: req.query.count || 50
		};

	//Filter
	if (req.query.filter && !_.isEmpty(req.query.filter) && req.query.filter.length > 2) {
		query.where('symbol').in(JSON.parse(req.query.filter).symbol.toUpperCase().split(','));
	}

	//Sort
	if (req.query.sort && req.query.sort.length > 2) {
		var sortKey = JSON.parse(req.query.sort).predicate,
			direction = JSON.parse(req.query.sort).reverse ? 'desc' : 'asc';
	
		query.sort({[sortKey] : direction});
	}
	else {
		query.sort({isCash: 'asc', symbol: 'asc'});
	}

	query.page(pagination, function(err, stockpositions){
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(stockpositions);
		}
	});
};

exports.getSymbols = function(user, callback) {
	Stockposition.aggregate([
		{
			$match : {symbol : {$ne : 'CASH'}}
		},
        {
			$group: {
				_id: null,
				symbols: {$addToSet: {$concat: ['$symbol', '.TO']}} 
				//grouper: {$push: '$symbol'}
				//total: {$sum: '$market'}
				//_id : null, // Will group by everything 
			}
		}
    ], 
	function (err, result) {
        if (err) {
            console.log('Error:', err);
        }

		callback(null, result[0].symbols);
	});	
};

/**
 * Find the stockpositions you currently hold
 * Get the updated ones from yahoo
 * Currently this doesn't use the User but it should
 */
exports.listDaily = function(user, callback) {
	exports.getSymbols(user, function(err, symbols) {
		quote.yahooQuotes(symbols, function(err, updatedQuotes) {
			if (err) {
				console.log('Error:', err);
			}

			callback(updatedQuotes);
		});
	});
};

/**
 * Stockposition middleware
 */
exports.stockpositionByID = function(req, res, next, id) {
	Stockposition.findById(id).populate('user', 'displayName').exec(function(err, stockposition) {
		if (err) return next(err);
		if (! stockposition) return next(new Error('Failed to load Stockposition ' + id));
		req.stockposition = stockposition;
		next();
	});
};

/**
 * Stockposition authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.stockposition.user.id !== req.user.id) {
		return res.status(403).send({message: 'User is not authorized'});
	}
	next();
};