
import * as crypto from 'crypto';
import * as async from 'async';
import * as nodemailer from 'nodemailer';
import { Mongoose as mongoose, Model as model } from 'mongoose';
import { lodash as _ } from 'lodash';
import { Request, Response, NextFunction } from 'express';

import * as errorHandler from '../error.controller';
import { IUserModel } from '../../models/user.model';
import * as config from '../../../config/config';

let User = new model('User');

/**
 * Forgot for reset password (forgot POST)
 * @param req
 * @param res
 * @param next
 */
export function forgot(req: Request, res: Response, next: NextFunction) {
	async.waterfall([
		// Generate random token
		function (done: any) {
			crypto.randomBytes(20, function (err: Error, buffer: Buffer) {
				let token = buffer.toString('hex');
				done(err, token);
			});
		},
		// Lookup user by username
		function (token: string, done: any) {
			if (req.body.username) {
				User.findOne({
					username: req.body.username
				}, '-salt -password', function (err: string, user: IUserModel) {
					if (!user) {
						return res.status(400).send({
							message: 'No account with that username has been found'
						});
					} else if (user.provider !== 'local') {
						return res.status(400).send({
							message: 'It seems like you signed up using your ' + user.provider + ' account'
						});
					} else {
						user.resetPasswordToken = token;
						user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

						user.save(function (err: string) {
							done(err, token, user);
						});
					}
				});
			} else {
				return res.status(400).send({
					message: 'Username field must not be blank'
				});
			}
		},
		function (token: string, user: IUserModel, done: any) {
			res.render('templates/reset-password-email', {
				name: user.displayName,
				appName: config.getConfig().app.title,
				url: 'http://' + req.headers.host + '/auth/reset/' + token
			}, function (err: Error, emailHTML: string) {
				done(err, emailHTML, user);
			});
		},
		// If valid email, send reset email using service
		function (emailHTML: string, user: IUserModel, done: any) {
			let smtpTransport = nodemailer.createTransport(config.getConfig().mailer.transport);
			let mailOptions = {
				to: user.email,
				from: config.getConfig().mailer.from,
				subject: 'Password Reset',
				html: emailHTML
			};
			smtpTransport.sendMail(mailOptions, function (err: Error) {
				if (!err) {
					res.send({
						message: 'An email has been sent to ' + user.email + ' with further instructions.'
					});
				}

				done(err);
			});
		}
	], function (err: Error) {

		if (err) {
			return next(err);
		}
	});
};

/**
 * Reset password GET from email token
 * @param req
 * @param res
 */
export function validateResetToken(req: Request, res: Response) {
	User.findOne({
		resetPasswordToken: req.params.token,
		resetPasswordExpires: {
			$gt: Date.now()
		}
	}, function (err: string, user: IUserModel) {
		if (!user) {
			return res.redirect('/#!/password/reset/invalid');
		}

		res.redirect('/#!/password/reset/' + req.params.token);
	});
};

/**
 * Reset password POST from email token
 * @param req
 * @param res
 * @param next
 */
export function reset(req: Request, res: Response, next: NextFunction) {
	// Init Variables
	let passwordDetails = req.body;

	async.waterfall([

		function (done: any) {
			User.findOne({
				resetPasswordToken: req.params.token,
				resetPasswordExpires: {
					$gt: Date.now()
				}
			}, function (err: string, user: IUserModel) {
				if (!err && user) {
					if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
						user.password = passwordDetails.newPassword;
						user.resetPasswordToken = undefined;
						user.resetPasswordExpires = undefined;

						user.save(function (err: string) {
							if (err) {
								return res.status(400).send({
									message: errorHandler.getErrorMessage(err)
								});
							} else {
								req.login(user, function (err: string) {
									if (err) {
										res.status(400).send(err);
									} else {
										// Return authenticated user
										res.json(user);

										done(err, user);
									}
								});
							}
						});
					} else {
						return res.status(400).send({
							message: 'Passwords do not match'
						});
					}
				} else {
					return res.status(400).send({
						message: 'Password reset token is invalid or has expired.'
					});
				}
			});
		},
		function (user: IUserModel, done: any) {
			res.render('templates/reset-password-confirm-email', {
				name: user.displayName,
				appName: config.getConfig().app.title
			}, function (err: any, emailHTML: string) {
				done(err, emailHTML, user);
			});
		},
		// If valid email, send reset email using service
		function (emailHTML: string, user: IUserModel, done: any) {
			let smtpTransport = nodemailer.createTransport(config.getConfig().mailer.options);
			let mailOptions = {
				to: user.email,
				from: config.getConfig().mailer.from,
				subject: 'Your password has been changed',
				html: emailHTML
			};

			smtpTransport.sendMail(mailOptions, function (err: Error) {
				done(err, 'done');
			});
		}
	], function (err: Error) {
		if (err) {
			return next(err);
		}
	});
};

/**
 * Change Password
 * @param req
 * @param res
 */
export function changePassword(req: Request, res: Response) {
	// Init Variables
	let passwordDetails = req.body;

	if (req.user) {
		if (passwordDetails.newPassword) {
			User.findById(req.user.id, function (err: Error, user: IUserModel) {
				if (!err && user) {
					if (User.authenticate(passwordDetails.currentPassword)) {
						if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
							user.password = passwordDetails.newPassword;

							user.save(function (err: Error) {
								if (err) {
									return res.status(400).send({
										message: errorHandler.getErrorMessage(err)
									});
								} else {
									req.login(user, function (err: Error) {
										if (err) {
											res.status(400).send(err);
										} else {
											res.send({
												message: 'Password changed successfully'
											});
										}
									});
								}
							});
						} else {
							res.status(400).send({
								message: 'Passwords do not match'
							});
						}
					} else {
						res.status(400).send({
							message: 'Current password is incorrect'
						});
					}
				} else {
					res.status(400).send({
						message: 'User is not found'
					});
				}
			});
		} else {
			res.status(400).send({
				message: 'Please provide a new password'
			});
		}
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};
