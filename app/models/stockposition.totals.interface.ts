import * as mongoose from 'mongoose';

export interface IStockpositionTotals extends mongoose.Document {
	market: Number;
	book: Number;
    gainLoss: Number;
    gainLossPct: Number;
};
