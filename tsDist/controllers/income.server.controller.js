'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'), errorHandler = require('./errors.server.controller'), Income = mongoose.model('Income'), _ = require('lodash');
/**
 * Create a Income
 */
exports.create = function (req, res) {
    var income = new Income(req.body);
    income.user = req.user;
    income.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            res.jsonp(income);
        }
    });
};
/**
 * Show the current Income
 */
exports.read = function (req, res) {
    res.jsonp(req.income);
};
/**
 * Update a Income
 */
exports.update = function (req, res) {
    var income = req.income;
    income = _.extend(income, req.body);
    income.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            res.jsonp(income);
        }
    });
};
/**
 * Delete an Income
 */
exports.delete = function (req, res) {
    var income = req.income;
    income.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            if (err) {
                return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
            }
            res.jsonp(income);
        }
    });
};
/**
 * List of Income - not currently used
 */
exports.list = function (req, res) {
    var query = Income.find(), pagination = {
        start: ((req.query.page || 1) - 1) * (req.query.count || 50),
        count: req.query.count || 50
    };
    //Sort
    if (req.query.sort && req.query.sort.length > 2) {
        var sortKey = JSON.parse(req.query.sort).predicate, direction = JSON.parse(req.query.sort).reverse ? 'desc' : 'asc';
        query.sort({ [sortKey]: direction });
    }
    else {
        query.sort({ date: 'asc' });
    }
    query.page(pagination, function (err, incomes) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            res.jsonp(incomes);
        }
    });
};
/**
 * Attempts to parse and group by the corporations name.
 * Because we don't have any sort of symbol or other information.
 */
exports.listByDescription = function (req, res) {
    var query = Income.find(), pagination = {
        start: ((req.query.page || 1) - 1) * (req.query.count || 50),
        count: req.query.count || 50
    };
    //Sort
    if (req.query.sort && req.query.sort.length > 2) {
        var sortKey = JSON.parse(req.query.sort).predicate, direction = JSON.parse(req.query.sort).reverse ? 'desc' : 'asc';
        query.sort({ [sortKey]: direction });
    }
    else {
        query.sort({ date: 'asc' });
    }
    Income.aggregate([
        {
            $group: {
                _id: '$description',
                totalmv: { $sum: '$market' },
                totalbook: { $sum: '$book' }
            }
        }
    ], function (err, result) {
        var income = new Income();
        if (err) {
            return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
        }
        else {
            res.jsonp(result);
        }
    });
};
/**
 * Income middleware
 */
exports.incomeByID = function (req, res, next, id) {
    Income.findById(id).populate('user', 'displayName').exec(function (err, income) {
        if (err)
            return next(err);
        if (!income)
            return next(new Error('Failed to load Income ' + id));
        req.income = income;
        next();
    });
};
/**
 * Income authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.user.id !== req.user.id) {
        return res.status(403).send({ message: 'User is not authorized' });
    }
    next();
};
//# sourceMappingURL=income.server.controller.js.map