import * as mongoose from 'mongoose';
import { IFundamentalModel } from '../models/fundamental.interface';

let schema: mongoose.Schema = new Schema({
	Symbol: {
		type: String
	},
	YahooSymbol: {
		type: String
	},
	lastUpdated: {
		type: Date,
		default: Date.now
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	EarningsShare: {
		type: Number
	},
	EPSEstimateCurrentYear: {
		type: Number
	},
	EPSEstimateNextQuarter: {
		type: Number
	},
	EPSEstimateNextYear: {
		type: Number
	},
	PriceSales: {
		type: Number
	},
	PriceBook: {
		type: Number
	},
	ExDividendDate: {
		type: String
	},
	DividendPayDate: {
		type: String
	},
	PERatio: {
		type: Number
	}
})
.pre('save', function (next: any) {
	if (this._doc) {
		let doc = <IFundamentalModel>this._doc;

		if (!doc.created) {
			doc.created = new Date();
		}
	}
	next();
 	return this;
});

export let FundamentalSchema = mongoose.model<IFundamentalModel>('fundamental', schema);
