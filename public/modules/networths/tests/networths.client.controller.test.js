'use strict';

(function() {
	// Networths Controller Spec
	describe('Networths Controller Tests', function() {
		// Initialize global variables
		var NetworthsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Networths controller.
			NetworthsController = $controller('NetworthsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Networth object fetched from XHR', inject(function(Networths) {
			// Create sample Networth using the Networths service
			var sampleNetworth = new Networths({
				name: 'New Networth'
			});

			// Create a sample Networths array that includes the new Networth
			var sampleNetworths = [sampleNetworth];

			// Set GET response
			$httpBackend.expectGET('networths').respond(sampleNetworths);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.networths).toEqualData(sampleNetworths);
		}));

		it('$scope.findOne() should create an array with one Networth object fetched from XHR using a networthId URL parameter', inject(function(Networths) {
			// Define a sample Networth object
			var sampleNetworth = new Networths({
				name: 'New Networth'
			});

			// Set the URL parameter
			$stateParams.networthId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/networths\/([0-9a-fA-F]{24})$/).respond(sampleNetworth);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.networth).toEqualData(sampleNetworth);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Networths) {
			// Create a sample Networth object
			var sampleNetworthPostData = new Networths({
				name: 'New Networth'
			});

			// Create a sample Networth response
			var sampleNetworthResponse = new Networths({
				_id: '525cf20451979dea2c000001',
				name: 'New Networth'
			});

			// Fixture mock form input values
			scope.name = 'New Networth';

			// Set POST response
			$httpBackend.expectPOST('networths', sampleNetworthPostData).respond(sampleNetworthResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Networth was created
			expect($location.path()).toBe('/networths/' + sampleNetworthResponse._id);
		}));

		it('$scope.update() should update a valid Networth', inject(function(Networths) {
			// Define a sample Networth put data
			var sampleNetworthPutData = new Networths({
				_id: '525cf20451979dea2c000001',
				name: 'New Networth'
			});

			// Mock Networth in scope
			scope.networth = sampleNetworthPutData;

			// Set PUT response
			$httpBackend.expectPUT(/networths\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/networths/' + sampleNetworthPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid networthId and remove the Networth from the scope', inject(function(Networths) {
			// Create new Networth object
			var sampleNetworth = new Networths({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Networths array and include the Networth
			scope.networths = [sampleNetworth];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/networths\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleNetworth);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.networths.length).toBe(0);
		}));
	});
}());