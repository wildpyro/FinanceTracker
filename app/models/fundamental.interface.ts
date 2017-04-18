import * as mongoose from 'mongoose';

export interface IFundamentalModel extends mongoose.Document {
	Symbol: String;
	YahooSymbol: String;
	lastUpdated: Date;
	created: Date;
	user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }];
	EarningsShare: Number;
	EPSEstimateCurrentYear: Number;
	EPSEstimateNextQuarter: Number;
	EPSEstimateNextYear: Number;
	PriceSales: Number;
	PriceBook: Number;
	ExDividendDate: String;
	DividendPayDate: String;
	PERatio: Number;
}; ;
