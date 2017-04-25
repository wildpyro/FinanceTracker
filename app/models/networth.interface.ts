import * as mongoose from 'mongoose';

export interface INetworthModel extends mongoose.Document {
	description: String;
	created: Date;
	user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }];
};

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
});

schema.pre('save', function (next: any) {
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
