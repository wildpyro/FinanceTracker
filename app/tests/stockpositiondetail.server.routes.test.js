'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Stockpositiondetail = mongoose.model('Stockpositiondetail'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, stockpositiondetail;

/**
 * Stockpositiondetail routes tests
 */
describe('Stockpositiondetail CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Stockpositiondetail
		user.save(function() {
			stockpositiondetail = {
				name: 'Stockpositiondetail Name'
			};

			done();
		});
	});

	it('should be able to save Stockpositiondetail instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Stockpositiondetail
				agent.post('/stockpositiondetails')
					.send(stockpositiondetail)
					.expect(200)
					.end(function(stockpositiondetailSaveErr, stockpositiondetailSaveRes) {
						// Handle Stockpositiondetail save error
						if (stockpositiondetailSaveErr) done(stockpositiondetailSaveErr);

						// Get a list of Stockpositiondetails
						agent.get('/stockpositiondetails')
							.end(function(stockpositiondetailsGetErr, stockpositiondetailsGetRes) {
								// Handle Stockpositiondetail save error
								if (stockpositiondetailsGetErr) done(stockpositiondetailsGetErr);

								// Get Stockpositiondetails list
								var stockpositiondetails = stockpositiondetailsGetRes.body;

								// Set assertions
								(stockpositiondetails[0].user._id).should.equal(userId);
								(stockpositiondetails[0].name).should.match('Stockpositiondetail Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Stockpositiondetail instance if not logged in', function(done) {
		agent.post('/stockpositiondetails')
			.send(stockpositiondetail)
			.expect(401)
			.end(function(stockpositiondetailSaveErr, stockpositiondetailSaveRes) {
				// Call the assertion callback
				done(stockpositiondetailSaveErr);
			});
	});

	it('should not be able to save Stockpositiondetail instance if no name is provided', function(done) {
		// Invalidate name field
		stockpositiondetail.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Stockpositiondetail
				agent.post('/stockpositiondetails')
					.send(stockpositiondetail)
					.expect(400)
					.end(function(stockpositiondetailSaveErr, stockpositiondetailSaveRes) {
						// Set message assertion
						(stockpositiondetailSaveRes.body.message).should.match('Please fill Stockpositiondetail name');
						
						// Handle Stockpositiondetail save error
						done(stockpositiondetailSaveErr);
					});
			});
	});

	it('should be able to update Stockpositiondetail instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Stockpositiondetail
				agent.post('/stockpositiondetails')
					.send(stockpositiondetail)
					.expect(200)
					.end(function(stockpositiondetailSaveErr, stockpositiondetailSaveRes) {
						// Handle Stockpositiondetail save error
						if (stockpositiondetailSaveErr) done(stockpositiondetailSaveErr);

						// Update Stockpositiondetail name
						stockpositiondetail.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Stockpositiondetail
						agent.put('/stockpositiondetails/' + stockpositiondetailSaveRes.body._id)
							.send(stockpositiondetail)
							.expect(200)
							.end(function(stockpositiondetailUpdateErr, stockpositiondetailUpdateRes) {
								// Handle Stockpositiondetail update error
								if (stockpositiondetailUpdateErr) done(stockpositiondetailUpdateErr);

								// Set assertions
								(stockpositiondetailUpdateRes.body._id).should.equal(stockpositiondetailSaveRes.body._id);
								(stockpositiondetailUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Stockpositiondetails if not signed in', function(done) {
		// Create new Stockpositiondetail model instance
		var stockpositiondetailObj = new Stockpositiondetail(stockpositiondetail);

		// Save the Stockpositiondetail
		stockpositiondetailObj.save(function() {
			// Request Stockpositiondetails
			request(app).get('/stockpositiondetails')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Stockpositiondetail if not signed in', function(done) {
		// Create new Stockpositiondetail model instance
		var stockpositiondetailObj = new Stockpositiondetail(stockpositiondetail);

		// Save the Stockpositiondetail
		stockpositiondetailObj.save(function() {
			request(app).get('/stockpositiondetails/' + stockpositiondetailObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', stockpositiondetail.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Stockpositiondetail instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Stockpositiondetail
				agent.post('/stockpositiondetails')
					.send(stockpositiondetail)
					.expect(200)
					.end(function(stockpositiondetailSaveErr, stockpositiondetailSaveRes) {
						// Handle Stockpositiondetail save error
						if (stockpositiondetailSaveErr) done(stockpositiondetailSaveErr);

						// Delete existing Stockpositiondetail
						agent.delete('/stockpositiondetails/' + stockpositiondetailSaveRes.body._id)
							.send(stockpositiondetail)
							.expect(200)
							.end(function(stockpositiondetailDeleteErr, stockpositiondetailDeleteRes) {
								// Handle Stockpositiondetail error error
								if (stockpositiondetailDeleteErr) done(stockpositiondetailDeleteErr);

								// Set assertions
								(stockpositiondetailDeleteRes.body._id).should.equal(stockpositiondetailSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Stockpositiondetail instance if not signed in', function(done) {
		// Set Stockpositiondetail user 
		stockpositiondetail.user = user;

		// Create new Stockpositiondetail model instance
		var stockpositiondetailObj = new Stockpositiondetail(stockpositiondetail);

		// Save the Stockpositiondetail
		stockpositiondetailObj.save(function() {
			// Try deleting Stockpositiondetail
			request(app).delete('/stockpositiondetails/' + stockpositiondetailObj._id)
			.expect(401)
			.end(function(stockpositiondetailDeleteErr, stockpositiondetailDeleteRes) {
				// Set message assertion
				(stockpositiondetailDeleteRes.body.message).should.match('User is not logged in');

				// Handle Stockpositiondetail error error
				done(stockpositiondetailDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Stockpositiondetail.remove().exec(function(){
				done();
			});	
		});
	});
});
