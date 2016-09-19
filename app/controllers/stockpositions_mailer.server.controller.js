'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    mailer = require('nodemailer'),
    config = require('../../config/config'),
    async = require('async'),
    scheduler = require('./scheduler.server.controller'),
    StockPositions = require('./stockpositions.server.controller'),
    User = mongoose.model('User');

function search(done, user) {
    StockPositions.listDaily(user, function(err, stockpositions) {
        done(err,user,stockpositions);
    }); 
}

/*function generateEmail(user, stockpositions, done) {
    /*var sendDailtStockList = transporter.templateSender({
        subject: 'Daily Stock Changes',
        text: 'Hello, {{user.displayName}},',
        html: '<b>Hello, <strong>{{username}}</strong>, Your password is:\n<b>{{ password }}</b></p>'
    }, {
        from: '{{config.mailer.from}}',
    });*/

    /*res.render('templates/dailyStockPositions', {
        name: user.displayName,
        appName: config.app.title
    }, function(err, emailHTML) {
        done(err, emailHTML, user);
    });*/
/*}*/

function sendMail(user, done) {
    var smtpTransport = mailer.createTransport(config.mailer.transport);

    var mailOptions = {
        to: user.email,
        from: config.mailer.from,
        subject: 'Daily Stock Changes',
        html: 'This is a test for user {{user.displayName}}'
    };

    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('success!');
            done(err);
        }
    });
}

exports.dailyStockPositions = function(user)  {
    
    //setup the waterfall calls.     
    async.waterfall([
        search(user),
        //generateEmail(user, stockpositions),
        sendMail(user)
	], 
    function(err) {
		if (err) return err;
	});
};