'use strict';
/**
 * Module dependencies.
 */
var should = require('should'), mongoose = require('mongoose'), User = mongoose.model('User'), Stockpositiondetail = mongoose.model('Stockpositiondetail');
/**
 * Globals
 */
var user, stockpositiondetail;
/**
 * Unit tests
 */
describe('Stockpositiondetail Model Unit Tests:', function () {
    beforeEach(function (done) {
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: 'username',
            password: 'password'
        });
        user.save(function () {
            stockpositiondetail = new Stockpositiondetail({
                name: 'Stockpositiondetail Name',
                user: user
            });
            done();
        });
    });
    describe('Method Save', function () {
        it('should be able to save without problems', function (done) {
            return stockpositiondetail.save(function (err) {
                should.not.exist(err);
                done();
            });
        });
        it('should be able to show an error when try to save without name', function (done) {
            stockpositiondetail.name = '';
            return stockpositiondetail.save(function (err) {
                should.exist(err);
                done();
            });
        });
    });
    afterEach(function (done) {
        Stockpositiondetail.remove().exec(function () {
            User.remove().exec(function () {
                done();
            });
        });
    });
});
//# sourceMappingURL=stockpositiondetail.server.model.test.js.map