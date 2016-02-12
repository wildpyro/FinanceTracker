'use strict';

(function() {
	// Stockpositions Controller Spec
	describe('Stockpositions Controller Tests', function() {
		// Initialize global variables
		var StockpositionsController,
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

			// Initialize the Stockpositions controller.
			StockpositionsController = $controller('StockpositionsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Stockposition object fetched from XHR', inject(function(Stockpositions) {
			// Create sample Stockposition using the Stockpositions service
			var sampleStockposition = new Stockpositions({
				name: 'New Stockposition'
			});

			// Create a sample Stockpositions array that includes the new Stockposition
			var sampleStockpositions = [sampleStockposition];

			// Set GET response
			$httpBackend.expectGET('stockpositions').respond(sampleStockpositions);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.stockpositions).toEqualData(sampleStockpositions);
		}));

		it('$scope.findOne() should create an array with one Stockposition object fetched from XHR using a stockpositionId URL parameter', inject(function(Stockpositions) {
			// Define a sample Stockposition object
			var sampleStockposition = new Stockpositions({
				name: 'New Stockposition'
			});

			// Set the URL parameter
			$stateParams.stockpositionId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/stockpositions\/([0-9a-fA-F]{24})$/).respond(sampleStockposition);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.stockposition).toEqualData(sampleStockposition);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Stockpositions) {
			// Create a sample Stockposition object
			var sampleStockpositionPostData = new Stockpositions({
				name: 'New Stockposition'
			});

			// Create a sample Stockposition response
			var sampleStockpositionResponse = new Stockpositions({
				_id: '525cf20451979dea2c000001',
				name: 'New Stockposition'
			});

			// Fixture mock form input values
			scope.name = 'New Stockposition';

			// Set POST response
			$httpBackend.expectPOST('stockpositions', sampleStockpositionPostData).respond(sampleStockpositionResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Stockposition was created
			expect($location.path()).toBe('/stockpositions/' + sampleStockpositionResponse._id);
		}));

		it('$scope.update() should update a valid Stockposition', inject(function(Stockpositions) {
			// Define a sample Stockposition put data
			var sampleStockpositionPutData = new Stockpositions({
				_id: '525cf20451979dea2c000001',
				name: 'New Stockposition'
			});

			// Mock Stockposition in scope
			scope.stockposition = sampleStockpositionPutData;

			// Set PUT response
			$httpBackend.expectPUT(/stockpositions\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/stockpositions/' + sampleStockpositionPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid stockpositionId and remove the Stockposition from the scope', inject(function(Stockpositions) {
			// Create new Stockposition object
			var sampleStockposition = new Stockpositions({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Stockpositions array and include the Stockposition
			scope.stockpositions = [sampleStockposition];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/stockpositions\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleStockposition);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.stockpositions.length).toBe(0);
		}));
	});
}());