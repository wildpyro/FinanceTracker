import * as mongoose from 'mongoose';

export interface IStockpositionDetailModel extends mongoose.Document {
	symbol: String;
	quote: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quote' }];
	fundamentals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Fundamentals' }];
	performance: [{ type: mongoose.Schema.Types.ObjectId, ref: 'performance' }];
};

let schema: mongoose.Schema = new mongoose.Schema({
	symbol: {
		type: String
	},
	quote: [{
		type: mongoose.Types.ObjectId,
		ref: 'Quote'
	}],
	fundamentals: [{
		type: mongoose.Types.ObjectId,
		ref: 'Fundamentals'
	}],
	performance: [{
		type: mongoose.Types.ObjectId,
		ref: 'Performance'
	}]
});

export let StockpositionDetailSchema = mongoose.model<IStockpositionDetailModel>('stockpositionDetail', schema);
