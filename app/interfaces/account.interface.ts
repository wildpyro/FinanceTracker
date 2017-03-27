import { Schema } from 'mongoose';

export interface IAccount {
  description?: string;
  accountNo?: String; enum: ['open', 'rsp', 'tfsa', 'resp', 'joint'];
  accountType?: string;
  created?: Date;
  user?: String;
  stockPositions: [{ type: Schema.Types.ObjectId, ref: 'Stockposition' }];
  marketValue?: Number;
}
