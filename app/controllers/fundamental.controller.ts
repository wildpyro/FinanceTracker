import { Model as model, Mongoose as mongoose } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import * as errorHandler from './error.controller';
import { IFundamentalModel } from '../models/fundamental.model';

let Fundamentals = new model('Fundamentals');

exports.localSearch = function (symbol: String, res: Response) {
	var fundamentals = Fundamentals.findOne({ 'Symbol': symbol });

	fundamentals.exec(function (err: Error, fundamentals: IFundamentalModel) {
		if (err) {
			return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
		}
		else {
			res.jsonp(fundamentals);
		}
	});
};
