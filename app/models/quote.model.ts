import * as mongoose from 'mongoose';

export interface IQuoteModel extends mongoose.Document {
	lastUpdated: Date;
	Symbol: String;
	Change: String;
	DaysLow: Number;
	DaysHigh: Number;
	YearLow: Number;
	YearHigh: Number;
	DaysRange: String;
	Name: String;
	Volume: Number;
	StockExchange: String;
	YahooSymbol: String;
	PreviousClose: Number;
	Open: Number;
	PercentChangeFromYearLow: String;
	MarketCapitalization: String;
	PercentChange: String;
	created: Date;
};

let schema: mongoose.Schema = new Schema({
	lastUpdated: {
		type: Date
	},
	Symbol: {
		type: String
	},
	Change: {
		type: String
	},
	DaysLow: {
		type: Number
	},
	DaysHigh: {
		type: Number
	},
	YearLow: {
		type: Number
	},
	YearHigh: {
		type: Number
	},
	DaysRange: {
		type: String
	},
	Name: {
		type: String
	},
	Volume: {
		type: Number
	},
	StockExchange: {
		type: String
	},
	YahooSymbol: {
		type: String
	},
	PreviousClose: {
		type: Number
	},
	Open: {
		type: Number
	},
	PercentChangeFromYearLow: {
		type: String
	},
	MarketCapitalization: {
		type: String
	},
	PercentChange: {
		type: String
	},
	created: {
		type: Date,
		default: Date.now
	}
}).pre('save', function (next: any) {
	if (this._doc) {
		let doc = <IQuoteModel>this._doc;

		if (!doc.created) {
			doc.created = new Date();
		}
	}
	next();
	return this;
});

export let QuoteSchema = mongoose.model<IQuoteModel>('quote', schema);
