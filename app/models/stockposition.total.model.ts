import * as mongoose from 'mongoose';

export interface IStockpositionTotal extends mongoose.Document {
    market: Number;
    book: Number;
    gainLoss: Number;
    gainLossPct: Number;
};

let schema: mongoose.Schema = new Schema({
    market: {
        type: Number,
        default: 0
    },
    book: {
        type: Number,
        default: 0
    },
    gainLoss: {
        type: Number,
        default: 0
    },
    gainLossPct: {
        type: Number,
        default: 0
    }
});

export let StockpositionTotalSchema = mongoose.model<IStockpositionTotal>('spTotals', schema);
