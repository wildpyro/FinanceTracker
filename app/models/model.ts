import { Model } from 'mongoose';
import { IAccountModel } from './account.model';

export interface IModel {
  account: Model<IAccountModel>;
}
