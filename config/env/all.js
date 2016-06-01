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
				'public/lib/bootstrap/dist/css/bootstrap-theme.css'
			],
			js: [
				'public/lib/angular/angular.js',
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js',
				'public/lib/jquery/dist/jquery.js',
				'public/lib/bootstrap/dist/js/bootstrap.js', 				
				'public/lib/angular-bootstrap/ui-bootstrap-custom-tpls-1.3.3.js',
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/api-check/dist/api-check.js',
				'public/lib/angular-formly/dist/formly.js',
				'public/lib/angular-formly-templates-bootstrap/dist/angular-formly-templates-bootstrap.js',
				'public/lib/angular-smart-table/dist/smart-table.js',
				'public/lib/angular-ui-scroll/dist/ui-scroll.js',
				'public/lib/angular-ui-scrollpoint/dist/scrollpoint.js',
				'public/lib/angular-ui-event/dist/event.js',	
				'public/lib/angular-ui-mask/dist/mask.js',
				'public/lib/angular-ui-validate/dist/validate.js',
				'public/lib/angular-ui-indeterminate/dist/indeterminate.js',
				'public/lib/angular-ui-uploader/dist/uploader.js'
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
