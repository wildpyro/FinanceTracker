import * as mongoose from 'mongoose';

export interface INetworthModel extends mongoose.Document {
	description: String;
	created: Date;
	user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }];
};
