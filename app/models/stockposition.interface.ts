import * as mongoose from 'mongoose';
import { Exchanges } from '../enums/exchanges.enums';
import { AccountTypes } from '../enums/account_types.enums';
import { AssetTypes } from '../enums/asset_types.enums';

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
