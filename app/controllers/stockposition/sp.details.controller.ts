import { Model as model, Mongoose as mongoose } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import * as _ from 'lodash';
import * as errorHandler from '../error.controller';
import { IStockpositionDetailModel } from '../../models/stockposition.detail.model';

let QuoteModel = new model('Quote'),
	Stockpositiondetail = new model('Stockpositiondetail');

/**
 * Show the current Stockpositiondetail
 */
export function read(req: Request, res: Response) {
	res.jsonp(req.body.stockpositiondetail);
};

/**
 * List of Stockpositiondetails
 */
export function listQuoteDetails(req: Request, res: Response) {

	if (req.query.symbol !== null && req.query.symbol !== undefined && req.query.symbol !== '') {
		Quote.yahooQuote(req.query.symbol, res);
	}
	else {
		return new Error('You must select a symbol');
	}
};

/**
 * Stockpositiondetail middleware
 */
export function stockpositiondetailByID(req: Request, res: Response, next: NextFunction, id: number) {
	Stockpositiondetail
		.findById(id).populate('user', 'displayName')
		.exec(function (err: Error, stockpositiondetail: IStockpositionDetailModel) {

			if (err) {
				return next(err);
			}
			if (!stockpositiondetail) {
				return next(new Error('Failed to load Stockpositiondetail ' + id));
			}

			req.body.stockpositiondetail = stockpositiondetail;
			next();
		});
};

/**
 * Stockpositiondetail authorization middleware
 */
export function hasAuthorization(req: Request, res: Response, next: NextFunction) {
	if (req.body.stockpositiondetail.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
