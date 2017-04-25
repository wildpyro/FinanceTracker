import * as mongoose from 'mongoose';
import { Exchanges, EXCHANGES } from '../enums/exchanges.enums';
import { AccountTypes, ACCOUNTTYPES } from '../enums/account_types.enums';
import { AssetTypes, ASSETTYPES } from '../enums/asset_types.enums';

export interface IStockpositionModel extends mongoose.Document {
	accountType: AccountTypes;
	exchange: Exchanges;
	symbol: String;
	price: Number;
	shares: Number;
	market: Number;
	book: Number;
	description: String;
	type: AssetTypes;
	quoteData: {};
	created: Date;
	user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }];
};

let schema: mongoose.Schema = new Schema({
	accountType: {
		type: String, enum: _.map(ACCOUNTTYPES, 'type')
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
	market: {
		type: Number,
		default: 0,
		required: 'Please fill in a market value'
	},
	book: {
		type: Number,
		default: 0,
		required: 'Please fill in the book cost'
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	assetType: {
		type: String, enum: _.map(ASSETTYPES, 'type'),
		trim: true
	},
	quoteData: {}
});

export let StockpositionSchema = mongoose.model<IStockpositionModel>('stockposition', schema);
