import * as _ from 'lodash';
import * as async from 'async';
import { Model as model, Mongoose as mongoose } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import * as schedule from 'node-schedule';
import * as nodemailer from 'nodemailer';
import * as ErrorHandler from './error.controller';
import * as quoteCtrl from './quote.controller';
import * as stockPositionsCtrl from './stockposition/sp.base.controller';


let User = new model('User');
let StockPositions = new model('StockPositions');

/**
 * Send out an email of the daily sotck positions
 */
export function dailyStockPositionsSchedule() {
    let j = schedule.scheduleJob({ hour: 16, minute: 0, dayOfWeek: 1 - 5 }, function () {

        async.waterfall([
            function (callback) {
                User.find().exec(function (err: Error, users) {
                    callback(err, users);
                });
            },
            function (users, callback) {
                users.forEach(function (err: Error, user) {
                    if (err) {
                        callback(err, null);
                    }

                    //Send an email to every user
                    mailer.sendMail(user, function (err: Error, message) {
                        callback(err, message);
                    });
                });
            }
        ],
            function (err: Error) {
                if (err) {
                    return err;
                }
            });
    });
};

/**
 * Update stock positions with new quote data
 * Right now this does one call at a time. Bulk call would probably be better.
 */
export function dailyQuoteUpdateSchedule() {
    let j = schedule.scheduleJob({ hour: 15, minute: 45, dayOfWeek: 1 - 5 }, function () {
        async.waterfall([
            function (callback: any) {
                User.find().exec(function (err: Error, users) {
                    callback(err, users);
                });
            },
            function (users, callback) {
                users.forEach(function (user) {
                    StockPositions.getSymbols(user, function (err: Error, positions) {
                        callback(err, positions);
                    }, this);
                });
            },
            function (positions, callback: any) {
                positions.forEach(function (position) {
                    quoteCtrl.yahooQuote(position.symbol, function (err: Error, quote) {
                        stockPositionsCtrl.updatePriceInner(position.symbol, quote.price);
                    }, this);
                });
            }
        ],
            function (err: Error) {
                if (err) {
                    return err;
                }
            });
    });
};
