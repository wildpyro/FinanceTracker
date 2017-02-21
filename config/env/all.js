'use strict';

module.exports = {
	app: {
		title: 'FinanceTracker',
		description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
		keywords: 'MongoDB, Express, AngularJS, Node.js'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				'public/lib/angular-material/angular-material.css'
				],
			js: [
				'public/lib/angular/angular.js',
				'public/lib/angular-animate/angular-animate.min.js', 
				'public/lib/angular-resource/angular-resource.min.js', 
				'public/lib/angular-sanitize/angular-sanitize.min.js',
				'public/lib/angular-aria/angular-aria.min.js',
				'public/lib/angular-messages/angular-messages.min.js',
				'public/lib/angular-material/angular-material.min.js',
				'public/lib/jquery/dist/jquery.min.js',
				'public/lib/bootstrap/dist/js/bootstrap.js', 				
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js', //Need to get rid of this and bootstrap. Only using modal and accordion.
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/api-check/dist/api-check.js',
				'public/lib/angular-formly/dist/formly.js',
				'public/lib/angular-smart-table/dist/smart-table.js',
				'public/lib/moment/moment.js',
				'public/lib/moment-range/dist/moment-range.js',
				'public/lib/angular-moment/angular-moment.js',
				'public/lib/angular-bindonce/bindonce.js',
				'public/lib/angular-formly-material/dist/formly-material.js'
				]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
