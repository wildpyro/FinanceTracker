import { Schema } from 'mongoose';

export var accountSchema: Schema = new Schema({
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
		required: [validateLocalStrategyProperty, 'Please fill the account no'],
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
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	stockPositions: [{type: Schema.Types.ObjectId, ref: 'Stockposition'}],
	marketValue: {
		type: Number
	}
});

accountSchema.pre('save', function(next) {

  if (!this.created) {
    this.created = Date.now;
  }

  next();
});
