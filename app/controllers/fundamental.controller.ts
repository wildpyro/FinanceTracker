'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Fundamentals = mongoose.model('Fundamentals'),
	_ = require('lodash');

exports.localSearch = function (symbol, res) {
	var fundamentals = Fundamentals.findOne({ 'Symbol': symbol });

	fundamentals.exec(function (err, fundamentals) {
		if (err) {
			return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
		}
		else {
			res.jsonp(fundamentals);
		}
	});
};