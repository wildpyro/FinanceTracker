'use strict';

module.exports = {
	db: 'mongodb://localhost/financetracker-dev',
	app: {
		title: 'FinanceTracker - Development Environment'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || 'APP_ID',
		clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
		clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || 'APP_ID',
		clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
		callbackURL: '/auth/google/callback'
	},
	yahoo: {
		clientID: process.env.YAHOO_ID || 'dj0yJmk9UEZ2dVR0MW9DdGRzJmQ9WVdrOVVHSjNXVkJ3Tm1VbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD1kYg--',
		clientSecret: process.env.YAHOO_SECRET || '333e37c4369865acb17233cfd83a12b83ee8c710',
		callbackURL: '/auth/yahoo/callback'
	},
	mailer: {
		from: 'bendzundel@gmail.com',
		transport: 'smtps://user%40gmail.com:pass@smtp.gmail.com',
		transportoptions: {
			service: 'Gmail',
			auth: {
				user: 'bendzundel',
				pass: 'theempaumjojphxi'
			}
		}
	}
};
