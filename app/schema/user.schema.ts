import * as mongoose from 'mongoose';
import * as crypto from 'crypto';
import * as IUser from '../models/user.interface';

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property: String) {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
	return (this.provider !== 'local' || (password && password.length > 6));
};

let schema: mongoose.Schema = new Schema({
	firstName: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in your first name']
	},
	lastName: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in your last name']
	},
	displayName: {
		type: String,
		trim: true
	},
	email: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in your email'],
		match: [/.+\@.+\..+/, 'Please fill a valid email address']
	},
	username: {
		type: String,
		unique: 'testing error message',
		required: 'Please fill in a username',
		trim: true
	},
	password: {
		type: String,
		default: '',
		validate: [validateLocalStrategyPassword, 'Password should be longer']
	},
	paging: {
		type: Number,
		default: 10
	},
	salt: {
		type: String
	},
	provider: {
		type: String,
		required: 'Provider is required'
	},
	providerData: {},
	additionalProvidersData: {},
	roles: {
		type: [{
			type: String,
			enum: ['user', 'admin']
		}],
		default: ['user']
	},
	updated: {
		type: Date
	},
	created: {
		type: Date,
		default: Date.now
	},
	/* For reset password */
	resetPasswordToken: {
		type: String
	},
	resetPasswordExpires: {
		type: Date
	}
}).pre('save', function (next: any) {
	if (this._doc) {
		let doc = <IUser.IUserModel>this._doc;

		if (!doc.created) {
			doc.created = new Date();
		}

		if (doc.password && doc.password.length > 6) {
			doc.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
			doc.password = IUser.hashPassword(doc.password, doc.salt);
		}
	}
	next();
 	return this;
});

export let UserSchema = mongoose.model<IUser.IUserModel>('user', schema);
