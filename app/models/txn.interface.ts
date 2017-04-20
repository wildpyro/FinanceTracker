import * as mongoose from 'mongoose';
import { Exchanges } from '../enums/exchanges.enums';
import { AccountTypes } from '../enums/account_types.enums';
import { CurrencyTypes } from '../enums/currency_types.enums';
import { TxnTypes } from '../enums/txn_types.enums';

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
