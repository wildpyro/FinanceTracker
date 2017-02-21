'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'), errorHandler = require('./errors.server.controller'), Performance = mongoose.model('Performance'), _ = require('lodash');
exports.localSearch = function (symbol, res) {
    var performance = Performance.findOne({ 'Symbol': symbol });
    performance.exec(function (err, performance) {
        if (err) {
            return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
        }
        else {
            res.jsonp(performance);
        }
    });
};
//# sourceMappingURL=performance.server.controller.js.map