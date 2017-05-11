/**
 * Express config called from server.js
 */
import * as fs from 'fs';
import * as https from 'https';
import * as express from 'express';
import * as logger from 'morgan';
import * as compression from 'compression';
import * as path from 'path';
import * as config from './config';
import { bodyParser } from 'body-parser';
import { session } from 'express-session';
import { methodOverride } from 'method-override';
import { cookieParser } from 'cookie-parser';
import { helmet } from 'helmet';
import * as passport from 'passport';
import { consolidate } from 'consolidate';

let MongoStore = require('connect-mongo')({ session: session });

class App {

	// ref to Express instance
	public express: express.Application;

	//Run configuration methods on the Express instance.
	constructor() {
		this.express = express();
		this.setLocals();
		this.middleware();

		// Passing the request url to environment locals
		this.express.use(function (req: express.Request, res: express.Response, next: express.NextFunction) {
			res.locals.url = req.protocol + '://' + req.headers.host + req.url;
			next();
		});

		/**
		 * init http compression
		 * Should be placed before express.static
		 */
		this.express.use(compression({
			filter: function (req: express.Request, res: express.Response) {
				return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
			},
			level: 9
		}));

		// Showing stack errors
		this.express.set('showStackError', true);

		//Set template engine
		this.setTemplates();

		//set body parser for http body resolution
		this.setBodyParser();

		// CookieParser should be above session
		this.express.use(cookieParser());

		this.setMongoSession();

		// init passport
		this.express.use(passport.initialize());
		this.express.use(passport.session());

		// Use helmet to secure Express headers
		this.express.use(helmet());

		// Setting the app router and static folder
		this.express.use(express.static(path.resolve('./public')));

		// verify routes
		this.setRouteResolution();

		//set env
		this.setEnv();
	}

	// Configure Express middleware.
	private middleware(): void {
		this.express.use(logger('dev'));
		this.express.use(bodyParser.json());
		this.express.use(bodyParser.urlencoded({ extended: false }));
	}

	private setBodyParser(): void {
		// Request body parsing middleware should be above methodOverride
		this.express.use(bodyParser.urlencoded({
			extended: true
		}));

		this.express.use(bodyParser.json());
		this.express.use(methodOverride());
	}

	/**
	 * Set the environment
	 * Configure the server and return it
	 */
	private setEnv(): https.Server {

		// Environment dependent middleware
		if (process.env.NODE_ENV === 'development') {
			this.express.use(logger('dev'));

			// Disable views cache
			this.express.set('view cache', false);
		}
		else if (process.env.NODE_ENV === 'production') {
			this.express.locals.cache = 'memory';
		}
		else if (process.env.NODE_ENV === 'secure') {
			// Log SSL usage
			console.log('Securely using https protocol');

			// Load SSL key and certificate
			var privateKey = fs.readFileSync('./config/sslcerts/key.pem', 'utf8');
			var certificate = fs.readFileSync('./config/sslcerts/cert.pem', 'utf8');

			// Create HTTPS Server
			var httpsServer = https.createServer({
				key: privateKey,
				cert: certificate
			}, this.express);

			// Return HTTPS server instance
			return httpsServer;
		}
	};

	/**
	 * set express config and locals
	 */
	private setLocals(): void {
		config.getGlobbedFiles('./app/models/**/*.js', null).forEach(function (modelPath: string) {
			require(path.resolve(modelPath));
		});

		// Setting application local variables
		var configApp = config.getConfig();
		this.express.locals.title = configApp.app.title;
		this.express.locals.description = configApp.app.description;
		this.express.locals.keywords = configApp.app.keywords;
		this.express.locals.facebookAppId = configApp.facebook.clientID;
		this.express.locals.jsFiles = config.getJavaScriptAssets(null);
		this.express.locals.cssFiles = config.getCSSAssets();
	};

	/**
	 * Sets the mongo session storage in express
	 */
	private setMongoSession(): void {
		this.express.use(session({
			saveUninitialized: true,
			resave: true,
			secret: config.getConfig().sessionSecret,
			store: new MongoStore({ url: 'mongodb://localhost/finance-tracker-dev', collection: config.getConfig().sessionCollection })
		}));
	}

	/**
	 * Set swig as the template engine
	 * Set views path and view engine
	 */
	private setTemplates(): void {
		this.express.engine('server.view.html', consolidate[config.getConfig().templateEngine]);
		this.express.set('view engine', 'server.view.html');
		this.express.set('views', './app/views');
	}

	/**
	 * initialize all the routes and verify they exist
	 */
	private setRouteResolution(): void {
		config.getGlobbedFiles('./app/routes/**/*.js', null).forEach(function (routePath: String) {
			require(path.resolve(routePath))();
		});

		this.express.use(function (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
			// If the error object doesn't exists
			if (!err) {
				return next();
			}

			// Log it
			console.error(err.stack);

			// Error page
			res.status(500).render('500', {
				error: err.stack
			});
		});

		// Assume 404 since no middleware responded
		this.express.use(function (req: any, res: any) {
			res.status(404).render('404', {
				url: req.originalUrl,
				error: 'Not Found'
			});
		});
	}
}

export default new App().express;
