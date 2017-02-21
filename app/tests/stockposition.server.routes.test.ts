'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Stockposition = mongoose.model('Stockposition'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, stockposition;

/**
 * Stockposition routes tests
 */
describe('Stockposition CRUD tests', function() {
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

		// Save a user to the test db and create new Stockposition
		user.save(function() {
			stockposition = {
				name: 'Stockposition Name'
			};

			done();
		});
	});

	it('should be able to save Stockposition instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Stockposition
				agent.post('/stockpositions')
					.send(stockposition)
					.expect(200)
					.end(function(stockpositionSaveErr, stockpositionSaveRes) {
						// Handle Stockposition save error
						if (stockpositionSaveErr) done(stockpositionSaveErr);

						// Get a list of Stockpositions
						agent.get('/stockpositions')
							.end(function(stockpositionsGetErr, stockpositionsGetRes) {
								// Handle Stockposition save error
								if (stockpositionsGetErr) done(stockpositionsGetErr);

								// Get Stockpositions list
								var stockpositions = stockpositionsGetRes.body;

								// Set assertions
								(stockpositions[0].user._id).should.equal(userId);
								(stockpositions[0].name).should.match('Stockposition Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Stockposition instance if not logged in', function(done) {
		agent.post('/stockpositions')
			.send(stockposition)
			.expect(401)
			.end(function(stockpositionSaveErr, stockpositionSaveRes) {
				// Call the assertion callback
				done(stockpositionSaveErr);
			});
	});

	it('should not be able to save Stockposition instance if no name is provided', function(done) {
		// Invalidate name field
		stockposition.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Stockposition
				agent.post('/stockpositions')
					.send(stockposition)
					.expect(400)
					.end(function(stockpositionSaveErr, stockpositionSaveRes) {
						// Set message assertion
						(stockpositionSaveRes.body.message).should.match('Please fill Stockposition name');
						
						// Handle Stockposition save error
						done(stockpositionSaveErr);
					});
			});
	});

	it('should be able to update Stockposition instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Stockposition
				agent.post('/stockpositions')
					.send(stockposition)
					.expect(200)
					.end(function(stockpositionSaveErr, stockpositionSaveRes) {
						// Handle Stockposition save error
						if (stockpositionSaveErr) done(stockpositionSaveErr);

						// Update Stockposition name
						stockposition.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Stockposition
						agent.put('/stockpositions/' + stockpositionSaveRes.body._id)
							.send(stockposition)
							.expect(200)
							.end(function(stockpositionUpdateErr, stockpositionUpdateRes) {
								// Handle Stockposition update error
								if (stockpositionUpdateErr) done(stockpositionUpdateErr);

								// Set assertions
								(stockpositionUpdateRes.body._id).should.equal(stockpositionSaveRes.body._id);
								(stockpositionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Stockpositions if not signed in', function(done) {
		// Create new Stockposition model instance
		var stockpositionObj = new Stockposition(stockposition);

		// Save the Stockposition
		stockpositionObj.save(function() {
			// Request Stockpositions
			request(app).get('/stockpositions')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Stockposition if not signed in', function(done) {
		// Create new Stockposition model instance
		var stockpositionObj = new Stockposition(stockposition);

		// Save the Stockposition
		stockpositionObj.save(function() {
			request(app).get('/stockpositions/' + stockpositionObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', stockposition.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Stockposition instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Stockposition
				agent.post('/stockpositions')
					.send(stockposition)
					.expect(200)
					.end(function(stockpositionSaveErr, stockpositionSaveRes) {
						// Handle Stockposition save error
						if (stockpositionSaveErr) done(stockpositionSaveErr);

						// Delete existing Stockposition
						agent.delete('/stockpositions/' + stockpositionSaveRes.body._id)
							.send(stockposition)
							.expect(200)
							.end(function(stockpositionDeleteErr, stockpositionDeleteRes) {
								// Handle Stockposition error error
								if (stockpositionDeleteErr) done(stockpositionDeleteErr);

								// Set assertions
								(stockpositionDeleteRes.body._id).should.equal(stockpositionSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Stockposition instance if not signed in', function(done) {
		// Set Stockposition user 
		stockposition.user = user;

		// Create new Stockposition model instance
		var stockpositionObj = new Stockposition(stockposition);

		// Save the Stockposition
		stockpositionObj.save(function() {
			// Try deleting Stockposition
			request(app).delete('/stockpositions/' + stockpositionObj._id)
			.expect(401)
			.end(function(stockpositionDeleteErr, stockpositionDeleteRes) {
				// Set message assertion
				(stockpositionDeleteRes.body.message).should.match('User is not logged in');

				// Handle Stockposition error error
				done(stockpositionDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Stockposition.remove().exec(function(){
				done();
			});	
		});
	});
});
