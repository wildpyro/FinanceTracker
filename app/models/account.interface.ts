import * as mongoose from 'mongoose';
import { AccountTypes } from '../enums/account_types.server.enums';

export interface IAccountModel extends mongoose.Document {
  description: string;
  accountNo: string;
  accountType: AccountTypes;
  created: Date;
  user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }];
  stockPositions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Stockposition' }];
  marketValue: Number;
}
