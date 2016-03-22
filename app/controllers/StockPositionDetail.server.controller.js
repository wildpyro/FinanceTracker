'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	StockPositionDetail = mongoose.model('StockPositionDetail'),
	_ = require('lodash'),
	yql = require('yql-node').formatAsJSON();

	var query = 'select * from yahoo.finance.quote where symbol in ("YHOO","AAPL","GOOG","MSFT")';

	yql.execute(query, function(error,response){
	    console.log('yql:');
	    console.log(response);
	  });

/**
 * Show the current StockPositionDetail
 */
exports.read = function(req, res) {
	res.jsonp(req.stockposition);
};

/**
 * StockPositionDetail middleware
 */
exports.StockPositionDetailBySPId = function(req, res, next, id) {
	StockPositionDetail.findBySPId(id).populate('user', 'displayName').exec(function(err, stockPositionsDetail) {
		if (err) return next(err);
		if (! stockPositionsDetail) return next(new Error('Failed to load StockPositionDetail ' + id));
		req.stockPositionsDetail = stockPositionsDetail ;
		next();
	});
};

/**
 * List of StockPositionDetails
 */
exports.list = function(req, res) {

	StockPositionDetail
		.findOne({'stockPositionId': req.id})
		.exec(function(err, stockPositionsDetail){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(stockPositionsDetail);
			}
		});
};

/**
 * StockPositionDetail authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.stockPositionsDetail.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
