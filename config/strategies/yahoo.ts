import * as passport from 'passport';
import * as url from 'url';
import { OAuth2Strategy as yahooStrat } from 'passport-yahoo-oauth';
import { Request, Response, NextFunction } from 'express';
import * as users from '../../app/controllers/users/users.authentication.server.controller';
import * as config from '../config';

class YahhooStrategy {
	constructor() {
		let yahooConfig = config.getConfig().yahoo;

		passport.use(new yahooStrat({
			consumerKey: yahooConfig.clientID,
			consumerSecret: yahooConfig.clientSecret,
			callbackURL: yahooConfig.callbackURL,
			passReqToCallback: true
		},
			function (req: Request, accessToken: string, refreshToken: string, profile: any, done: any) {
				// Set the provider data and include tokens
				var providerData = profile._json;
				providerData.accessToken = accessToken;
				providerData.refreshToken = refreshToken;

				// Create the user OAuth profile
				var providerUserProfile = {
					firstName: profile.name.givenName,
					lastName: profile.name.familyName,
					displayName: profile.displayName,
					email: profile.emails[0].value,
					username: profile.username,
					provider: 'yahoo',
					providerIdentifierField: 'id',
					providerData: providerData
				};

				// Save the user OAuth profile
				users.saveOAuthUserProfile(req, providerUserProfile, done);
			}
		));
	}
};
