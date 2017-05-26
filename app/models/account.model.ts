import * as mongoose from 'mongoose';
import { AccountTypes } from '../enums/account_types.enums';
import { IStockpositionModel } from './stockposition.model';

export interface IAccountModel extends mongoose.Document {
  description: string;
  accountNo: string;
  accountType: AccountTypes;
  created: Date;
  user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }];
  stockPositions: IStockpositionModel[];
  marketValue: Number;
}

let schema: mongoose.Schema = new mongoose.Schema({
  description: {
    type: String,
    default: '',
    required: 'Please fill in an account description',
    trim: true
  },
  accountNo: {
    type: String,
    default: '',
    length: 8,
    required: 'Please fill the account no',
    trim: true
  },
  accountType: {
    type: String, enum: ['open', 'rsp', 'tfsa', 'resp', 'joint'],
    required: 'Please select an account type',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  stockPositions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Stockposition' }],
  marketValue: {
    type: Number
  }
});

schema.pre('save', function (next: any) {
  if (this._doc) {
    let doc = <IAccountModel>this._doc;

    if (!doc.created) {
      doc.created = new Date();
    }
  }
  next();
  return this;
});

export let AccountSchema = mongoose.model<IAccountModel>('account', schema);
