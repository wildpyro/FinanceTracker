'use strict';

import * as _ from 'lodash';
import * as glob from 'glob';

import allConfig = require('./env/all');

interface Config {
	db: string;
	app: {};
	facebook: {};
	twitter: {};
	google: {};
	yahoo: {};
	mailer: {};
}

/**
 * Get the modules CSS files
 */
export function getCSSAssets(): Array<string> {
	var output = this.getGlobbedFiles(this.assets.lib.css.concat(this.assets.css), 'public/');
	return output;
};

/**
 * Get files by glob patterns
 * @param the pattern
 * @param whether you want to remove the root directory
 */
export function getGlobbedFiles(globPatterns: any, removeRoot: string): Array<string> {
	// For context switching
	var _this = this;

	// URL paths regex
	var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

	// The output array
	var output = [];

	// If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob
	if (_.isArray(globPatterns)) {
		globPatterns.forEach(function (globPattern: any) {
			output = _.union(output, _this.getGlobbedFiles(globPattern, removeRoot));
		});
	} else if (_.isString(globPatterns)) {
		if (urlRegex.test(globPatterns)) {
			output.push(globPatterns);
		}
		else {
			var files = glob(globPatterns, { sync: true });

			if (removeRoot) {
				files = files.map(function (file: any) {
					return file.replace(removeRoot, '');
				});
			}

			output = _.union(output, files);
		}
	}

	return output;
};

/**
 * Get the modules JavaScript files
 * @param whether to include the tests directory
 */
export function getJavaScriptAssets(includeTests: boolean): Array<string> {
	var output = this.getGlobbedFiles(this.assets.lib.js.concat(this.assets.js), 'public/');

	// To include tests
	if (includeTests) {
		output = _.union(output, this.getGlobbedFiles(this.assets.tests));
	}

	return output;
};

/**
 * Load app configurations
 * Add env to the base config
 */
export function getConfig(): any {

	return _.extend(allConfig, require('./env/' + process.env.NODE_ENV) || {});
};
