'use strict';

/**
 * Module dependencies.
 */
exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null,
		request: req
	});
};

//Checks to see whether the system has an internet connection 
exports.checkInternet = function(cb) {
    require('dns').lookup('google.com',function(err) {
        if (err && err.code === 'ENOTFOUND') {
            cb(false);
        } else {
            cb(true);
        }
    });
};