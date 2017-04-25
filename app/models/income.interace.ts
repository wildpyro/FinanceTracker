import * as mongoose from 'mongoose';

export interface IIncomeModel extends mongoose.Document {
	settlementDate: Date;
	description: String;
	symbol: String;
	price: Number;
	shares?: Number;
	exchangeRate?: Number;
	tradeCurrency: String;
	settle?: Number;
	created: Date;
	user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }];
};

let schema: mongoose.Schema = new Schema({
	settlementDate: {
		type: Date,
		required: 'Please fill in a date'
	},
	description: {
		type: String,
		default: '',
		required: 'Please fill in a description',
		trim: true
	},
	symbol: {
		type: String,
		default: '',
		required: 'Please fill in a symbol',
		uppercase: true,
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
		let doc = <IIncomeModel>this._doc;

		if (!doc.created) {
			doc.created = new Date();
		}
	}
	next();
	return this;
});

export let IncomeSchema = mongoose.model<IIncomeModel>('income', schema);
