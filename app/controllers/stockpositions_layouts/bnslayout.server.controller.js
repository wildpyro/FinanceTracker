'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('../errors.server.controller'),
	StockpositionModel = mongoose.model('Stockposition'),
	Stockposition = require('../stockpositions.server.controller'),
	_ = require('lodash'),
	//BaseLayout = require('./baselayout.server.class'),
	startPosition = 4,
	endPosition = 10,
	logicalRecordLength = 11,
	records = [{}];

class BaseLayout {
    constructor(layoutName, startPosition, endPosition, logicalRecordLength) {
        this.name = layoutName;
        this.startPosition = startPosition;
        this.endPosition = endPosition;
        this.logicalRecordLength = logicalRecordLength;     
    }
}

class BNSLayout extends BaseLayout{
	constructor(layoutName, startPosition, endPosition, logicalRecordLength) {
		super(layoutName, startPosition, endPosition, logicalRecordLength);
  	}
}

class BNSLayout_Record {
	constructor(row) {
		//accountType
		//isCash
		//type String, enum: ['cash','fixed','equity'] 

		this.symbol = row[1];
		//this.description = row[0]; Maybe use a regex with a word bountary for two spaces or the word Security
		this.price = row[4];
		this.shares = row[2]; 
		this.market = row[6];
		this.book = row[5];
	}
}

exports.importStockPosition = function(req, res) {

	var layout = req.body.type,
		fileData = req.body.file;

	var lines = fileData.split(/\r\n|\r|\n/);
	
	//strip the header and trailer rows 
	var linesLength = lines.length - startPosition - endPosition;
	var totalStocks = Number(linesLength) / Number(logicalRecordLength); 

	for (var i = 0; i <= totalStocks; i++) {
		var start = i * logicalRecordLength + startPosition; 
		
		if (i === 0) {
			start = startPosition;
		}

		var record = lines.slice(start,start+logicalRecordLength);

		//Get rid of the totals line at the end. 
		if (record.length === logicalRecordLength) {
			//Try and map to the bns layout model. 
			var rec = new BNSLayout_Record(record);

			records.push(rec);			
		}
	}

	console.log(records);
};