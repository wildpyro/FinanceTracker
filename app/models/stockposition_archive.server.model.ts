import * as mongoose from 'mongoose';
import { IStockpositionModel } from '../models/stockposition.interface';

export interface IStockpositionArchiveModel extends mongoose.Document {
	year: Number;
	month: String;
	date: Date;
	market: Number;
	book: Number;
	gainLoss: Number;
	gainLossPct: Number;
	stockpositions: Array<IStockpositionModel>;
	created: Date;
	user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }];
};