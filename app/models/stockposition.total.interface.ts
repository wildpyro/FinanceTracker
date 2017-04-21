import * as mongoose from 'mongoose';

export interface IStockpositionTotal extends mongoose.Document {
    market: Number;
    book: Number;
    gainLoss: Number;
    gainLossPct: Number;
};
