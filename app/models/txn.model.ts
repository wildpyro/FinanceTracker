import * as mongoose from 'mongoose';
import { AccountTypes, ACCOUNTTYPES } from '../enums/account_types.enums';
import { CurrencyTypes } from '../enums/currency_types.enums';
import { Exchanges, EXCHANGES } from '../enums/exchanges.enums';
import { TxnTypes, TXNTYPES } from '../enums/txn_types.enums';

export interface ITxnModel extends mongoose.Document {
	accountNo: string;
	accountType: AccountTypes;
	exchange: Exchanges;
	symbol: string;
	type: TxnTypes;
	settlementDate: Date;
	exchangeRate: Number;
	tradeCurrency: CurrencyTypes;
	price: Number;
	shares: Number;
	commission: Number;
	settle: Number;
	created: Date;
	user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }];
};

let schema: mongoose.Schema = new Schema({
	accountNo: {
		type: String,
		required: 'Please select an account no'
	},
	accountType: {
		type: String, enum: _.map(ACCOUNTTYPES, 'accountType'),
		required: 'Please select an account type',
		trim: true
	},
	exchange: {
		type: String, enum: _.map(EXCHANGES, 'exchange')
	},
	symbol: {
		type: String,
		default: '',
		required: 'Please fill in a symbol',
		uppercase: true,
		trim: true
	},
	type: {
		type: String, enum: _.map(TXNTYPES, 'type'),
		required: 'Please select a txn type',
		trim: true
	},
	settlementDate: {
		type: Date,
		required: 'Please fill in a date'
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
	commission: {
		type: Number,
		default: 0,
		required: 'Please fill in the commission amount'
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
		let doc = <ITxnModel>this._doc;

		if (!doc.created) {
			doc.created = new Date();
		}
	}
	next();
	return this;
});

export let TxnSchema = mongoose.model<ITxnModel>('txn', schema);