'use strict';
/**
 * Module dependencies.
 */
var schedule = require('node-schedule'),
    mongoose = require('mongoose'),
    mailer = require('nodemailer'),
    async = require('async'),
    quoteCtrl = require('./quotes.server.controller'),
    stockPositionsCtrl = require('./stockpositions.server.controller'),
    User = mongoose.model('User'),
    StockPositions = mongoose.model('StockPositions');

/**
 * Send out an email of the daily sotck positions 
 */
exports.dailyStockPositionsSchedule = function () {
  var j = schedule.scheduleJob({ hour: 16, minute: 0, dayOfWeek: 1 - 5 }, function () {

    async.waterfall([
      function(callback) {
        User.find().exec(function(err, users) {
          callback(err, users);
        });
      },
      function(users, callback) {
        users.forEach(function(err, user) {
          if (err) {
            callback(err, null);
          }

          //Send an email to every user
          mailer.sendMail(user, function (err, message) {
            callback(err, message);
          });          
        });
      }
    ], 
    function(err) {
		  if (err) return err;
    });
  });
};

/**
 * Update stock positions with new quote data
 * Right now this does one call at a time. Bulk call would probably be better. 
 */
exports.dailyQuoteUpdateSchedule = function () {
  var j = schedule.scheduleJob({ hour: 15, minute: 45, dayOfWeek: 1 - 5 }, function () {
    async.waterfall([
      function(callback) {
        User.find().exec(function(err, users) {
          callback(err, users);
        });
      },
      function(users, callback) {
          users.forEach(function(user) {
            StockPositions.getSymbols(user, function(err, positions) {
              callback(err,positions);
          }, this);
        });
      },
      function(positions, callback) {
          positions.forEach(function(position) {
            quoteCtrl.yahooQuote(position.symbol, function(err, quote) {
              stockPositionsCtrl.updatePriceInner(position.symbol, quote.price);
            }, this);
        });
      }
    ], 
    function(err) {
		  if (err) return err;
    });
  });
};
