'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'), mailer = require('nodemailer'), path = require('path'), EmailTemplates = require('swig-email-templates'), config = require('../../../config/config'), StockPositions = require('./sp.base.server.controller');
/**
 * Creates a mail transport object and sends mail based on what is in the config.
 * Currently this is defaulted to gmail and for that you need to generate app
 * specific password (google it). It will render the template using swig-email-template
 */
exports.sendMail = function (user, res) {
    //Get the stock positions
    StockPositions.listDaily(user, function (err, stockpositions) {
        if (err) {
            res(err);
        }
        var smtpTransport = mailer.createTransport(config.mailer.transportoptions), templateDir = path.resolve(__dirname, '../../views/templates'), quotes = JSON.parse(stockpositions).query.results.quote;
        var templates = new EmailTemplates({ root: templateDir }), context = {
            name: user.displayName,
            appName: 'Finance Tracker',
            stocks: quotes
        };
        //console.log(templates.root);            
        templates.render('daily-stock-positions.server.view.html', context, function (err, html, text, subject) {
            if (err) {
                console.log('error', err);
                res(err);
            }
            var options = {
                from: config.mailer.from,
                to: user.email,
                subject: 'Daily stock update',
                html: html,
                text: text
            };
            console.log('prep to send');
            smtpTransport.sendMail(options, function (err, info) {
                if (err)
                    console.log('error', err);
                res(err);
                //console.log(info);    
            });
        });
    });
};
//# sourceMappingURL=sp.mailer.server.controller.js.map