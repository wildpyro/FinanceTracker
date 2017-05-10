import * as passport from 'passport';
import { Strategy } from 'passport-local';
import { IUserModel } from '../../app/models/user.model';
import { Model as model } from 'mongoose';

/**
 * Create a local strategy
 */
class LocalStrategy {
	constructor() {
		passport.use(new Strategy({ usernameField: 'username', passwordField: 'password' },
			function (username: string, password: string, done: any) {
				let User = new model('User');

				User.findOne({
					username: username
				}, function (err: string, user: IUserModel) {
					if (err) {
						return done(err);
					}
					if (!user) {
						return done(null, false, {
							message: 'Unknown user or invalid password'
						});
					}
					if (!passport.authenticate(password)) {
						return done(null, false, {
							message: 'Unknown user or invalid password'
						});
					}

					return done(null, user);
				});
			}
		));
	}
}
