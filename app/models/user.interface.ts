import * as mongoose from 'mongoose';
import * as crypto from 'crypto';

User = mongoose.model('User');

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
	resetPasswordExpires: Date;

	//Define it's structure as part of the interface? hashPassword(password: string, salt: Buffer) : string;

};

/**
 * Create instance method for hashing a password
 * @param password
 * @param salt
 * @return string
 */
export function hashPassword(password: string, salt: Buffer) : string {
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
export function authenticate(password: string, salt: Buffer) : boolean {
	return password === hashPassword(password, salt);
};

/**
 * Find possible not used username
 * @param username
 * @param suffix
 * @param callback
 */
export function findUniqueUsername(username: string, suffix: string, callback: any) {
	var _this = this;
	var possibleUsername = username + (suffix || '');

	_this.findOne({
		username: possibleUsername
	}, function(err: any, user: IUserModel) {
		if (!err) {
			if (!user) {
				callback(possibleUsername);
			}
		} else {
			callback(null);
		}
	});
};
