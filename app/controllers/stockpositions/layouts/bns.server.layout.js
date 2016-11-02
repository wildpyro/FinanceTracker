'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	StockpositionModel = mongoose.model('Stockposition'),
	Txn = mongoose.model('Txn'),
	TxnTypes = require('../../../enums/txntypes.server.enums'),
	csvParse = require('csv-parse'),
	errorHandler = require('../../errors.server.controller'),
	Stockposition = require('../../stockpositions.server.controller'),
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

exports.importFiles = function(req, res) {

	var type = req.body.type;
		
	if (type === 'txnhist') {
		importTrades(req,res);
	}
	else if (type === 'incdiv') {
		importIncomeAndDividends(req,res);
	}
	else if (type === 'stocks') {
		importStockPosition(req,res);
	}
	else if (type === 'tax') {
		importTax(req,res);
	}
};

function importIncomeAndDividends(req, res) {
	console.log('div', req);
}

function importStockPosition(req, res) {

	var layout = req.body.layout,
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
}

function importTax(req, res) {
	console.log('tax', req);
}

/**
 * Attempt to import transactions from a CSV file from ITrade. Use an upsert to check if it alredy exists. 
 * Matching will be on accounttype, symbol, type, date
 */
function importTrades(req, res) {
	csvParse(req.body.file, {delimiter: ',', rowDelimiter: '\n', relax_column_count: 'true'}, function(err, output) {
		if (err) {
			console.log('Error:', err);	
		}

		var options = { 'upsert': true, 'new': true, 'setDefaultOnInsert': true },
			errorMessage;
		
		for (var i = 1; i <= output.length-1; i++) {

			var record = output[i];

			var description = String(record[0]).trim(),
				symbol = String(record[1]),
				date = record[2],
				type = record[5],
				shares = Number(record[6]),
				currency = record[7],
				price = Number(record[8]),
				settleAmount = Math.abs(Number(record[9]).toFixed(2)),
				bookAmount = Number(0.00),
				commission = Number(0.00),
				accountType = 'rsp';

			//The ITrade guys are createive with their descriptions 
			if (description.indexOf('DPP-Divd') !== -1 || description.indexOf('Reinvest') !== -1 || description.indexOf('REINVEST') !== -1) {
				type = 'Drip';
			}
			else {
				type = TxnTypes.getByITrade(type);
			}

			//Some trades don't have the price set for some stupid reason
			if (price === 0) {
				price = Number(settleAmount / shares).toFixed(2);
				bookAmount = settleAmount;
			}
			else {
				bookAmount = shares * price;
				commission = Math.abs(settleAmount - (shares * price)); 
			}

			var txn = new Txn({'date': date, 
								'accountType': accountType, 
								'symbol': symbol, 
								'type': type, 
								'price': price, 
								'shares': shares, 
								'commission': commission, 
								'settle': settleAmount, 
								'book': bookAmount, 
								'tradeinfo': description, 
								'user': req.user});								


			var query = Txn.findOneAndUpdate({'accountType': accountType, 'type': type, 'settle': settleAmount, 'date': date}, txn, options);
			query.exec(function(err, createdTxn) {	
				if (err) {
					errorMessage = errorHandler.getErrorMessage(err);
				}

				/* Reset the data for testing
				if (createdTxn.symbol || createdTxn.symbol === '') {
					Txn.remove(function(err) {
						if (err) {
							console.log('removal failed');
						}
						else {
							console.log('removal successful');
						}
					});
				}*/
			});

		}

		if (errorMessage) {
			return res.status(400).send({ message: errorMessage});	
		}
				
		return res.status(200).send({message: 'Transactions Loaded'});
		
	});	
}
