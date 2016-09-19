'use strict';
/**
 * Module dependencies.
 */
var schedule = require('node-schedule');

exports.dailyStockPositionsSchedule = function() {
  var j = schedule.scheduleJob({hour: 16, minute: 0, dayOfWeek: 1-5}, function(){
    console.log('Time for tea!');
  });
};