'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    quoteCtrl = require('../../controllers/quote.server.controller.js');

/**
 * Globals
 */
var quote;

/**
 * Unit tests
 */
describe('Quote Controller Unit Tests:', function () {

    describe('prepSymbols', function () {
        //Multiple symbols 
        it('Should format symbol multiple', function (done) {
            var tester = ['AX.UN.TSX','RY.TSX'];

            return quoteCtrl.prepSymbols(tester, function (err) {
                should.not.exist(err);
                done();
            });
        });

        //Single symbol 
        it('Should format symbol single', function (done) {
            var tester = ['AX.UN.TO'];
            return quoteCtrl.prepSymbols(tester, function (err) {
                should.not.exist(err);
                done();
            });
        });
    });

});
