import { Model as model } from 'mongoose';
import * as ErrorHandler from './error.controller';
import { Request, Response, NextFunction } from 'express';

export function localSearch(symbol: String, res: Response) {
	let Performance = new model('Performance');
	let performance = Performance.findOne({ 'Symbol': symbol });

	performance.exec(function (err: String, performance: Performance) {
		if (err) {
			return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
		}
		else {
			res.jsonp(performance);
		}
	});
};
