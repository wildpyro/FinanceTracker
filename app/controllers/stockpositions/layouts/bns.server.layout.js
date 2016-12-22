'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	StockpositionModel = mongoose.model('Stockposition'),
	Txn = mongoose.model('Txn'),
	GainLoss = mongoose.model('GainLoss'),
	Income = mongoose.model('Income'),
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
	else if (type === 'gainloss') {
		importGainLoss(req,res);
	}
	else if (type === 'stocks') {
		importStockPosition(req,res);
	}
	else if (type === 'tax') {
		importTax(req,res);
	}
};

/**
 * Import the gain/loss trade summary 
 */
function importGainLoss(req, res) {
	csvParse(req.body.file, {delimiter: ',', rowDelimiter: '\n', relax_column_count: 'true'}, function(err, output) {
		if (err) {
			console.log('Error:', err);	
		}

		var options = { 'upsert': true, 'new': true, 'setDefaultOnInsert': true },
			errorMessage;
		
		for (var i = 1; i <= output.length-1; i++) {

			var record = output[i],
				gainLoss = 
					new GainLoss({ 
						'settlementDate': record[3],
						'symbol': String(record[1]),
						'description': String(record[0]).trim(),
						'price': Number(record[7]),
						'shares': Math.abs(Number(record[6])),
						'exchangeRate': record[4],
						'tradeCurrency': record[8],
						'settle': Math.abs(Number(record[9]).toFixed(2)),
						'book': Number(record[10]),
						'gainLoss': Number(record[11]),
						'gainLossPct': Number(Number(record[11]) / Number(record[10]) * 100).toFixed(2),									 
						'user': req.user
					});
					
			var query = GainLoss.findOneAndUpdate({'settle': gainLoss.settleAmount, 'settlementDate': gainLoss.settlementDate}, gainLoss, options);
			query.exec(function(err, createdTxn) {	
				if (err) {
					errorMessage = errorHandler.getErrorMessage(err);
				}
			});
		}

		if (errorMessage) {
			return res.status(400).send({ message: errorMessage});	
		}
				
		return res.status(200).send({message: 'Gain/Loss loaded'});
	});
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

/**
 * Imports the tax liability for the year 
 * Will be a combination of trades and reinvests in my open accounts 
 */
function importTax(req, res) {
	console.log('tax', req);
}

/**
 * Attempt to import transactions from a CSV file from ITrade. Use an upsert to check if it alredy exists. 
 * Matching will be on accounttype, symbol, type, date
 * This process splits into two different tables 
 * 		1. To include real buys and sells  
 * 		2. Dividends will be pulled out and put into an income table.
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
				settlementDate = record[2],
				shares = Math.abs(Number(record[6])),
				price = Number(record[8]),
				settleAmount = Math.abs(Number(record[9]).toFixed(2)),
				accountType = 'rsp';

			//Do dividends
			if (symbol === null || symbol === ' ') {

				/**
				 * Only select specific records from the file.
				 * BNS BO is creative with their naming of txn types 
				 **/ 

				if (['CASH DIV', 'STOCKDIV', 'REI'].indexOf(record[5]) > -1 && settleAmount > 0) {					
					var income = 
						new Income({
								'settlementDate': settlementDate,  
								'description': description,
								'symbol': symbol,  
								'price': price, 
								'shares': shares,
								'exchangeRate': record[4],
								'tradeCurrency': record[7],								  
								'settle': settleAmount,
								'user': req.user});

					var queryDiv = Income.findOneAndUpdate({'settle': settleAmount, 'settlementDate': settlementDate}, income, options);
					queryDiv.exec(function(err, createdRow) {	
						if (err) {
							errorMessage = errorHandler.getErrorMessage(err);
						}
					});					
				}
			}
			//Do buys and sells 
			else {
				var txn = 
					new Txn({
							'settlementDate': settlementDate, 
							'accountType': accountType, 
							'symbol': symbol, 
							'type': TxnTypes.getByITrade(record[5]), 
							'price': price, 
							'shares': shares, 
							'commission': Math.abs(settleAmount - (shares * price)).toFixed(2),
							'exchangeRate': record[4],
							'tradeCurrency': record[7],									 
							'settle': settleAmount,  
							'user': req.user});

				var query = Txn.findOneAndUpdate({'accountType': txn.accountType, 'type': txn.type, 'settle': txn.settle, 'settlementDate': txn.settlementDate}, txn, options);
				query.exec(function(err, createdRow) {	
					if (err) {
						errorMessage = errorHandler.getErrorMessage(err);
					}
				});
			}
		}

		if (errorMessage) {
			return res.status(400).send({ message: errorMessage});	
		}
				
		return res.status(200).send({message: 'Transactions Loaded'});
		
	});	
}
