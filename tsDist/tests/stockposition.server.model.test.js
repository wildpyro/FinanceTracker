'use strict';
/**
 * Module dependencies.
 */
var should = require('should'), mongoose = require('mongoose'), User = mongoose.model('User'), Stockposition = mongoose.model('Stockposition');
/**
 * Globals
 */
var user, stockposition;
/**
 * Unit tests
 */
describe('Stockposition Model Unit Tests:', function () {
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
            stockposition = new Stockposition({
                name: 'Stockposition Name',
                user: user
            });
            done();
        });
    });
    describe('Method Save', function () {
        it('should be able to save without problems', function (done) {
            return stockposition.save(function (err) {
                should.not.exist(err);
                done();
            });
        });
        it('should be able to show an error when try to save without name', function (done) {
            stockposition.name = '';
            return stockposition.save(function (err) {
                should.exist(err);
                done();
            });
        });
    });
    afterEach(function (done) {
        Stockposition.remove().exec(function () {
            User.remove().exec(function () {
                done();
            });
        });
    });
});
//# sourceMappingURL=stockposition.server.model.test.js.map