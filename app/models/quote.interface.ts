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
