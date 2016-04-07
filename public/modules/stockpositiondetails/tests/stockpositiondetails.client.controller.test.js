'use strict';

(function() {
	// Stockpositiondetails Controller Spec
	describe('Stockpositiondetails Controller Tests', function() {
		// Initialize global variables
		var StockpositiondetailsController,
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

			// Initialize the Stockpositiondetails controller.
			StockpositiondetailsController = $controller('StockpositiondetailsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Stockpositiondetail object fetched from XHR', inject(function(Stockpositiondetails) {
			// Create sample Stockpositiondetail using the Stockpositiondetails service
			var sampleStockpositiondetail = new Stockpositiondetails({
				name: 'New Stockpositiondetail'
			});

			// Create a sample Stockpositiondetails array that includes the new Stockpositiondetail
			var sampleStockpositiondetails = [sampleStockpositiondetail];

			// Set GET response
			$httpBackend.expectGET('stockpositiondetails').respond(sampleStockpositiondetails);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.stockpositiondetails).toEqualData(sampleStockpositiondetails);
		}));

		it('$scope.findOne() should create an array with one Stockpositiondetail object fetched from XHR using a stockpositiondetailId URL parameter', inject(function(Stockpositiondetails) {
			// Define a sample Stockpositiondetail object
			var sampleStockpositiondetail = new Stockpositiondetails({
				name: 'New Stockpositiondetail'
			});

			// Set the URL parameter
			$stateParams.stockpositiondetailId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/stockpositiondetails\/([0-9a-fA-F]{24})$/).respond(sampleStockpositiondetail);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.stockpositiondetail).toEqualData(sampleStockpositiondetail);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Stockpositiondetails) {
			// Create a sample Stockpositiondetail object
			var sampleStockpositiondetailPostData = new Stockpositiondetails({
				name: 'New Stockpositiondetail'
			});

			// Create a sample Stockpositiondetail response
			var sampleStockpositiondetailResponse = new Stockpositiondetails({
				_id: '525cf20451979dea2c000001',
				name: 'New Stockpositiondetail'
			});

			// Fixture mock form input values
			scope.name = 'New Stockpositiondetail';

			// Set POST response
			$httpBackend.expectPOST('stockpositiondetails', sampleStockpositiondetailPostData).respond(sampleStockpositiondetailResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Stockpositiondetail was created
			expect($location.path()).toBe('/stockpositiondetails/' + sampleStockpositiondetailResponse._id);
		}));

		it('$scope.update() should update a valid Stockpositiondetail', inject(function(Stockpositiondetails) {
			// Define a sample Stockpositiondetail put data
			var sampleStockpositiondetailPutData = new Stockpositiondetails({
				_id: '525cf20451979dea2c000001',
				name: 'New Stockpositiondetail'
			});

			// Mock Stockpositiondetail in scope
			scope.stockpositiondetail = sampleStockpositiondetailPutData;

			// Set PUT response
			$httpBackend.expectPUT(/stockpositiondetails\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/stockpositiondetails/' + sampleStockpositiondetailPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid stockpositiondetailId and remove the Stockpositiondetail from the scope', inject(function(Stockpositiondetails) {
			// Create new Stockpositiondetail object
			var sampleStockpositiondetail = new Stockpositiondetails({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Stockpositiondetails array and include the Stockpositiondetail
			scope.stockpositiondetails = [sampleStockpositiondetail];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/stockpositiondetails\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleStockpositiondetail);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.stockpositiondetails.length).toBe(0);
		}));
	});
}());