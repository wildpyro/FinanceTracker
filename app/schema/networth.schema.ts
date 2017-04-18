import * as mongoose from 'mongoose';
import { INetworthModel } from '../models/networth.interface';

let schema: mongoose.Schema = new Schema({
	description: {
		type: String,
		default: '',
		required: 'Please fill in a description',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
}).pre('save', function (next: any) {
	if (this._doc) {
		let doc = <INetworthModel>this._doc;

		if (!doc.created) {
			doc.created = new Date();
		}
	}
	next();
 	return this;
});

export let NetworkSchema = mongoose.model<INetworthModel>('networth', schema);
