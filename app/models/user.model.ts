import * as mongoose from 'mongoose';
import * as crypto from 'crypto';

let User = mongoose.model('User');

export interface IUserModel extends mongoose.Document {
	firstName: string;
	lastName: string;
	displayName: string;
	email: string;
	username: string;
	password: string;
	paging: Number;
	salt: Buffer;
	provider: string;
	providerData: any;
	additionalProviderData: any;
	roles: string; enum: ['user', 'admin'];
	updated: Date;
	created: Date;
	resetPasswordToken: string;
	resetPasswordExpires: number;

	//Define it's structure as part of the interface? hashPassword(password: string, salt: Buffer) : string;

};

/**
 * A Validation function for local strategy properties
 */
let validateLocalStrategyProperty = function (property: string) {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
let validateLocalStrategyPassword = function (password: string) {
	return (this.provider !== 'local' || (password && password.length > 6));
};

/**
 * Create instance method for hashing a password
 * @param password
 * @param salt
 * @return string
 */
export function hashPassword(password: string, salt: Buffer): string {
	if (salt && password) {
		return crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('base64');
	} else {
		return password;
	}
};

/**
 * Create instance method for authenticating user
 * @param password
 * @param salt
 * @return boolean
 */
export function authenticate(password: string, salt: Buffer): boolean {
	return password === hashPassword(password, salt);
};

/**
 * Find possible not used username
 * @param username
 * @param suffix
 * @param callback
 */
export function findUniqueUsername(username: string, suffix: string, callback: any) {
	let _this = this;
	let possibleUsername = username + (suffix || '');

	_this.findOne({
		username: possibleUsername
	}, function (err: any, user: IUserModel) {
		if (!err) {
			if (!user) {
				callback(possibleUsername);
			}
		} else {
			callback(null);
		}
	});
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
		let doc = <IUserModel>this._doc;

		if (!doc.created) {
			doc.created = new Date();
		}

		if (doc.password && doc.password.length > 6) {
			doc.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
			doc.password = hashPassword(doc.password, doc.salt);
		}
	}
	next();
	return this;
});

export let UserSchema = mongoose.model<IUserModel>('user', schema);
