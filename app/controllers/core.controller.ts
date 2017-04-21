import { Request, Response } from 'express';

export function index(req: Request, res: Response) {
	res.render('index', {
		user: req.body.user || null,
		request: req
	});
};
