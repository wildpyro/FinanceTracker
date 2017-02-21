'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'), _ = require('lodash'), errorHandler = require('../errors.server.controller'), Quote = require('../quote.server.controller'), Performance = require('../performance.server.controller'), Fundamentals = require('../fundamentals.server.controller'), QuoteModel = mongoose.model('Quote'), Stockpositiondetail = mongoose.model('Stockpositiondetail');
/**
 * Show the current Stockpositiondetail
 */
exports.read = function (req, res) {
    res.jsonp(req.stockpositiondetail);
};
/**
 * List of Stockpositiondetails
 */
exports.listQuoteDetails = function (req, res) {
    if (req.query.symbol !== null && req.query.symbol !== undefined && req.query.symbol !== '') {
        Quote.yahooQuote(req.query.symbol, res);
    }
    else {
        return new Error('You must select a symbol');
    }
};
/**
 * Stockpositiondetail middleware
 */
exports.stockpositiondetailByID = function (req, res, next, id) {
    Stockpositiondetail.findById(id).populate('user', 'displayName').exec(function (err, stockpositiondetail) {
        if (err)
            return next(err);
        if (!stockpositiondetail)
            return next(new Error('Failed to load Stockpositiondetail ' + id));
        req.stockpositiondetail = stockpositiondetail;
        next();
    });
};
/**
 * Stockpositiondetail authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.stockpositiondetail.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};
//# sourceMappingURL=sp.details.server.controller.js.map