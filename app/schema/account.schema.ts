import * as mongoose from 'mongoose';
import { IAccountModel } from '../models/account.interface';

let schema: mongoose.Schema = new Schema({
	description: {
		type: String,
		default: '',
		required: 'Please fill in an account description',
		trim: true
	},
	accountNo: {
		type: String,
		default: '',
		length: 8,
		required: 'Please fill the account no',
		trim: true
	},
	accountType: {
		type: String, enum: ['open', 'rsp', 'tfsa', 'resp', 'joint'],
		required: 'Please select an account type',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	stockPositions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Stockposition' }],
	marketValue: {
		type: Number
	}
})
.pre('save', function (next: any) {
	if (this._doc) {
		let doc = <IAccountModel>this._doc;

		if (!doc.created) {
			doc.created = new Date();
		}
	}
	next();
 	return this;
});

export let AccountSchema = mongoose.model<IAccountModel>('account', schema);
