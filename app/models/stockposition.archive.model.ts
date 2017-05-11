import * as mongoose from 'mongoose';
import { IStockpositionModel } from '../models/stockposition.model';

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

let schema: mongoose.Schema = new Schema({
	archiveDate: {
		type: Date,
		default: Date.now
	},
	year: {
		type: 'Number'
	},
	month: {
		type: 'String'
	},
	date: {
		type: 'Date'
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
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
	},
	stockpositions: {
		type: []
	}
}).pre('save', function (next: any) {
	if (this._doc) {
		let doc = <IStockpositionArchiveModel>this._doc;

		if (!doc.created) {
			doc.created = new Date();
		}
	}
	next();
	return this;
});

export let StockPositionArchiveSchema = mongoose.model<IStockpositionArchiveModel>('StockPositionArchive', schema);
