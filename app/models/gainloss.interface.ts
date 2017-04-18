import * as mongoose from 'mongoose';

export interface IGainLossModel extends mongoose.Document {
	settlementDate: Date;
	description: String;
	symbol: String;
	price: Number;
	shares?: Number;
	exchangeRate?: Number;
    tradeCurrency: String;
	settle?: Number;
	book?: Number;
    gainLoss?: Number;
    gainLossPct?: Number;
	created: Date;
	user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }];
};
