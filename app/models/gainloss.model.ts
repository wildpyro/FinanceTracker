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

let schema: mongoose.Schema = new Schema({
	settlementDate: {
		type: Date,
		required: 'Please fill in a date'
	},
	symbol: {
		type: String,
		default: '',
		required: 'Please fill in a symbol',
		uppercase: true,
		trim: true
	},
	description: {
		type: String,
		default: '',
		required: 'Please fill in a description',
		trim: true
	},
	price: {
		type: Number,
		default: 0,
		required: 'Please fill in a price'
	},
	shares: {
		type: Number,
		default: 0,
		required: 'Please fill in the number of shares'
	},
	exchangeRate: {
		type: Number,
		default: 1,
		required: 'Please fill in the exchange rate'
	},
	tradeCurrency: {
		type: String,
		default: 'CAD',
		required: 'Please fill in the currency'
	},
	settle: {
		type: Number,
		default: 0,
		required: 'Please fill in the settle amount'
	},
	book: {
		type: Number,
		default: 0,
		required: 'Please fill in the book amount'
	},
	gainLoss: {
		type: Number,
		default: 0,
		required: 'Please fill in the gain loss amount'
	},
	gainLossPct: {
		type: Number,
		default: 0,
		required: 'Please fill in the gain loss percent'
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

schema.pre('save', function (next: any) {
	if (this._doc) {
		let doc = <IGainLossModel>this._doc;

		if (!doc.created) {
			doc.created = new Date();
		}
	}
	next();
	return this;
});

export let GainLossSchema = mongoose.model<IGainLossModel>('gainloss', schema);

