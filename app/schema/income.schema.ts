import * as mongoose from 'mongoose';
import { IIncomeModel } from '../models/income.interace';

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
}).pre('save', function (next: any) {
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
