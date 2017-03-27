import { Document } from 'mongoose';
import { IAccount } from '../interfaces/account.interface';

export interface IAccountModel extends IAccount, Document {
  //custom methods for your model would be defined here
}
