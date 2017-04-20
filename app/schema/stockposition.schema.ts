import * as mongoose from 'mongoose';
import * as _ from 'lodash';
import { ACCOUNTTYPES } from '../enums/account_types.enums';
import { ASSETTYPES } from '../enums/asset_types.enums';
import { EXCHANGES } from '../enums/exchanges.enums';
import { IStockpositionModel } from '../models/stockposition.interface';

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
