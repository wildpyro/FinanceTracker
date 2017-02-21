'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Networth = mongoose.model('Networth'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, networth;

/**
 * Networth routes tests
 */
describe('Networth CRUD tests', function() {
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

		// Save a user to the test db and create new Networth
		user.save(function() {
			networth = {
				name: 'Networth Name'
			};

			done();
		});
	});

	it('should be able to save Networth instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Networth
				agent.post('/networths')
					.send(networth)
					.expect(200)
					.end(function(networthSaveErr, networthSaveRes) {
						// Handle Networth save error
						if (networthSaveErr) done(networthSaveErr);

						// Get a list of Networths
						agent.get('/networths')
							.end(function(networthsGetErr, networthsGetRes) {
								// Handle Networth save error
								if (networthsGetErr) done(networthsGetErr);

								// Get Networths list
								var networths = networthsGetRes.body;

								// Set assertions
								(networths[0].user._id).should.equal(userId);
								(networths[0].name).should.match('Networth Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Networth instance if not logged in', function(done) {
		agent.post('/networths')
			.send(networth)
			.expect(401)
			.end(function(networthSaveErr, networthSaveRes) {
				// Call the assertion callback
				done(networthSaveErr);
			});
	});

	it('should not be able to save Networth instance if no name is provided', function(done) {
		// Invalidate name field
		networth.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Networth
				agent.post('/networths')
					.send(networth)
					.expect(400)
					.end(function(networthSaveErr, networthSaveRes) {
						// Set message assertion
						(networthSaveRes.body.message).should.match('Please fill Networth name');
						
						// Handle Networth save error
						done(networthSaveErr);
					});
			});
	});

	it('should be able to update Networth instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Networth
				agent.post('/networths')
					.send(networth)
					.expect(200)
					.end(function(networthSaveErr, networthSaveRes) {
						// Handle Networth save error
						if (networthSaveErr) done(networthSaveErr);

						// Update Networth name
						networth.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Networth
						agent.put('/networths/' + networthSaveRes.body._id)
							.send(networth)
							.expect(200)
							.end(function(networthUpdateErr, networthUpdateRes) {
								// Handle Networth update error
								if (networthUpdateErr) done(networthUpdateErr);

								// Set assertions
								(networthUpdateRes.body._id).should.equal(networthSaveRes.body._id);
								(networthUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Networths if not signed in', function(done) {
		// Create new Networth model instance
		var networthObj = new Networth(networth);

		// Save the Networth
		networthObj.save(function() {
			// Request Networths
			request(app).get('/networths')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Networth if not signed in', function(done) {
		// Create new Networth model instance
		var networthObj = new Networth(networth);

		// Save the Networth
		networthObj.save(function() {
			request(app).get('/networths/' + networthObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', networth.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Networth instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Networth
				agent.post('/networths')
					.send(networth)
					.expect(200)
					.end(function(networthSaveErr, networthSaveRes) {
						// Handle Networth save error
						if (networthSaveErr) done(networthSaveErr);

						// Delete existing Networth
						agent.delete('/networths/' + networthSaveRes.body._id)
							.send(networth)
							.expect(200)
							.end(function(networthDeleteErr, networthDeleteRes) {
								// Handle Networth error error
								if (networthDeleteErr) done(networthDeleteErr);

								// Set assertions
								(networthDeleteRes.body._id).should.equal(networthSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Networth instance if not signed in', function(done) {
		// Set Networth user 
		networth.user = user;

		// Create new Networth model instance
		var networthObj = new Networth(networth);

		// Save the Networth
		networthObj.save(function() {
			// Try deleting Networth
			request(app).delete('/networths/' + networthObj._id)
			.expect(401)
			.end(function(networthDeleteErr, networthDeleteRes) {
				// Set message assertion
				(networthDeleteRes.body.message).should.match('User is not logged in');

				// Handle Networth error error
				done(networthDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Networth.remove().exec(function(){
				done();
			});	
		});
	});
});
