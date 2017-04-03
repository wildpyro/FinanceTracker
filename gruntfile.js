'use strict';

module.exports = function (grunt) {
	/**
	 *  Watch objects are split up into peices that need to be linted via JS or ts
	 *  Config objects are still in JS 
	 **/
	var watchFiles = {
		serverViews: ['app/views/**/*.*'],
		configJS: ['gruntfile.js', 'server.js', 'config/**/*.js',],
		serverTS: ['app/**/*.ts'],
		clientViews: ['public/modules/**/views/**/*.html'],
		clientJS: ['public/js/*.js', 'public/modules/**/*.js'],
		//clientTS: ['public/js/*.ts', 'public/modules/**/*.ts'],
		lintCSS: ['public/modules/**/*.css', 'app/**/*.css'],
		mochaTests: ['app/tests/**/*.js']
	};

	var ignoreFiles = {
		node_modules: ['node_modules/*']
	};

	// Project Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		/* Create watches for each of the different componenets. This way we can apply different rules*/
		watch: {
			serverViews: {
				files: watchFiles.serverViews,
				options: {
					livereload: true
				}
			},
			serverConfig: {
				files: watchFiles.configJS,
				options: {
					livereload: true
				}
			},
			serverTS: {
				files: watchFiles.serverTS,
				//tasks: ['tslint'],
				options: {
					livereload: true
				}
			},
			clientViews: {
				files: watchFiles.clientViews,
				options: {
					livereload: true,
				}
			},
			clientJS: {
				files: watchFiles.clientJS,
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
			lintCSS: {
				files: watchFiles.lintCSS,
				tasks: ['csslint'],
				options: {
					livereload: true
				}
			}
		},
		/* Build tasks*/
		ts: {
			all: {
				files: [{
					//src: watchFiles.serverTS,
					src: ['**/*.ts', '!node_modules/**'],
					dest: 'tsDist'
				}],
				options: {
					module: 'commonjs',
					noLib: false,
					target: 'es6',
					sourceMap: false
				},
				'exclude': [
					ignoreFiles,
					'tsDist',
					'dist'
				]
			}
		},
		/* Lint tasks */
		jshint: {
			all: {
				src: watchFiles.clientJS,
				options: {
					jshintrc: true,
					force: true
				}
			}
		},
		tslint: {
			options: {
				configuration: 'tslint.json'
			},
			files: {
				src: watchFiles.serverTS
			}
		},
		csslint: {
			options: {
				csslintrc: '.csslintrc',
			},
			all: {
				src: watchFiles.lintCSS
			}
		},
		/* Deployment tasks */
		uglify: {
			production: {
				options: {
					mangle: false
				},
				files: {
					'public/dist/application.min.js': 'public/dist/application.js'
				}
			}
		},
		cssmin: {
			combine: {
				files: {
					'public/dist/application.min.css': '<%= applicationCSSFiles %>'
				}
			}
		},
		ngAnnotate: {
			production: {
				files: {
					'public/dist/application.js': '<%= applicationJavaScriptFiles %>'
				}
			}
		},
		/* Dev related */
		nodemon: {
			default: {
				script: 'server.js',
				stdout: true,
				options: {
					nodeArgs: ['--debug'],
					ext: 'js,html',
					watch: watchFiles.serverViews.concat(watchFiles.serverTS),
					ignore: ignoreFiles.node_modules
				}
			},
			dev: {
				script: 'server.js',
				stdout: true,
				options: {
					nodeArgs: ['--debug-brk'], //--debug or use --debug-brk
					ext: 'ts,js,html',
					watch: watchFiles.serverViews.concat(watchFiles.serverTS),
					ignore: ignoreFiles.node_modules
				}
			}
		},
		concurrent: {
			default: ['nodemon', 'watch'],
			debug: ['nodemon:dev', 'watch', 'node-inspector'],
			options: {
				logConcurrentOutput: true,
				limit: 10
			}
		},
		env: {
			test: {
				NODE_ENV: 'test'
			},
			secure: {
				NODE_ENV: 'secure'
			}
		}
	});

	// Load NPM tasks
	require('load-grunt-tasks')(grunt);

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-ts');
	grunt.loadNpmTasks('grunt-tslint');	

	// Making grunt default to force in order not to break the project.
	grunt.option('force', true);

	// A Task for loading the configuration object
	grunt.task.registerTask('loadConfig', 'Task that loads the config into a grunt option.', function () {
		var init = require('./config/init')();
		var config = require('./config/config');

		grunt.config.set('applicationJavaScriptFiles', config.assets.js);
		grunt.config.set('applicationCSSFiles', config.assets.css);
	});

	// Default task(s).
	grunt.registerTask('default', ['lint', 'tsbuild', 'concurrent:default']);

	// Debug task.
	grunt.registerTask('debug', ['lint', 'concurrent:debug']);

	// Secure task(s).
	grunt.registerTask('secure', ['env:secure', 'lint', 'concurrent:default']);

	// Lint task(s).
	grunt.registerTask('lint', ['jshint', 'csslint', 'tslint']);

	// Build task(s).
	grunt.registerTask('build', ['lint', 'loadConfig', 'ngAnnotate', 'uglify', 'cssmin']);

	//typescript build 
	//grunt.registerTask('tsbuild', ['lint', 'tsbuild']);
	grunt.registerTask('tsbuild', 'runs the main typescript build', ['lint', 'ts']);

	// Test task.
	//grunt.registerTask('test', ['env:test', 'mochaTest', 'karma:unit']);
	
};