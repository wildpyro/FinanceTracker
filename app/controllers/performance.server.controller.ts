'use strict';

/**
 * Module dependencies.
 */
import { Mongoose as mongoose } from 'mongoose';
import { Model as model } from 'mongoose';
import { lodash as _ } from 'lodash';
import * as ErrorHandler from './error.controller';
import { Request, Response, NextFunction } from 'express';

var Performance = new model('Performance');

exports.localSearch = function (symbol: String, res: Response) {
	var performance = Performance.findOne({ 'Symbol': symbol });

	performance.exec(function (err: String, performance: Performance) {
		if (err) {
			return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
		}
		else {
			res.jsonp(performance);
		}
	});
};
