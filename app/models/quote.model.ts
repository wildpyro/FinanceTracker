import * as mongoose from 'mongoose';

export interface IQuoteModel extends mongoose.Document {
	lastUpdated: Date;
	Symbol: string;
	Change: string;
	DaysLow: number;
	DaysHigh: number;
	YearLow: number;
	YearHigh: number;
	DaysRange: string;
	Name: string;
	Volume: number;
	StockExchange: string;
	YahooSymbol: string;
	LastTradePriceOnly: number;
	PreviousClose: number;
	Open: number;
	PercentChangeFromYearLow: string;
	MarketCapitalization: string;
	PercentChange: string;
	created: Date;
};

let schema: mongoose.Schema = new mongoose.Schema({
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
	LastTradePriceOnly: {
		type: Number
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
