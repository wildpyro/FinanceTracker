'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	_ = require('lodash'),
	Stockposition = mongoose.model('Stockposition'),
	SpTotals = mongoose.model('spTotals');

exports.calcTotal = function(user, callback) {
	Stockposition.aggregate([
		/*{
			$match : {user : user._id}
		},*/
        {
			$group: {
				_id: null,
				totalmv: {$sum: '$market'},
                totalbook: {$sum: '$book'} 
			}
		}
    ], 
	function (err, result) {

        if (err) {
            callback(err);
        }
 
		var spTotals = new SpTotals();
		spTotals.market = Number(result[0].totalmv).toFixed(2);
		spTotals.book = Number(result[0].totalbook).toFixed(2);
		spTotals.gainLoss = result[0].totalmv - result[0].totalbook; 
		spTotals.gainLossPct = Number(spTotals.gainLoss/spTotals.book * 100).toFixed(2);

		callback(spTotals);
	});
};

exports.calcTotalBySymbol = function(req, callback) {
	Stockposition.aggregate([
		{$unwind: '$stockpositions'},
		{$match : {'stockpositions.symbol' : req.symbol}}
    ], 
	function (err, result) {

        if (err) {
            callback(err);
        }
 
		var spTotals = new SpTotals();

		console.log(result);
		/*spTotals.market = Number(result[0].totalmv).toFixed(2);
		spTotals.book = Number(result[0].totalbook).toFixed(2);
		spTotals.gainLoss = result[0].totalmv - result[0].totalbook; 
		spTotals.gainLossPct = Number(spTotals.gainLoss/spTotals.book * 100).toFixed(2);*/

		callback(spTotals);
	});
};