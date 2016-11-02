'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'financetracker';
	var applicationModuleVendorDependencies = [
						'ngResource', 
						'ngCookies',  
						'ngAnimate',    
						'ngSanitize',
						'ngAria',  
						'ui.router',
						'ui.bootstrap',
						'ui.scroll',
						'ui.scrollpoint',
						'ui.event',
						'ui.mask',
						'ui.validate',
						'ui.indeterminate',
						'ui.uploader',
						'formly',
						'formlyBootstrap', 
						'smart-table',
						'angularMoment',
						'pasvaz.bindonce',
						'tawani.utils',
						'ngMaterial'
						];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
