'use strict';

// Stockpositiondetails controller
angular.module('stockpositiondetails').controller('StockpositiondetailsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Stockpositiondetails', 'TableSettings', 'StockpositiondetailsForm',
	function($scope, $stateParams, $location, Authentication, Stockpositiondetails, TableSettings, StockpositiondetailsForm ) {
		$scope.authentication = Authentication;
		$scope.tableParams = TableSettings.getParams(Stockpositiondetails);
		$scope.stockpositiondetail = {};

		$scope.setFormFields = function(disabled) {
			$scope.formFields = StockpositiondetailsForm.getFormFields(disabled);
		};


		// Create new Stockpositiondetail
		$scope.create = function() {
			var stockpositiondetail = new Stockpositiondetails($scope.stockpositiondetail);

			// Redirect after save
			stockpositiondetail.$save(function(response) {
				$location.path('stockpositiondetails/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Stockpositiondetail
		$scope.remove = function(stockpositiondetail) {

			if ( stockpositiondetail ) {
				stockpositiondetail = Stockpositiondetails.get({stockpositiondetailId:stockpositiondetail._id}, function() {
					stockpositiondetail.$remove();
					$scope.tableParams.reload();
				});

			} else {
				$scope.stockpositiondetail.$remove(function() {
					$location.path('stockpositiondetails');
				});
			}

		};

		// Update existing Stockpositiondetail
		$scope.update = function() {
			var stockpositiondetail = $scope.stockpositiondetail;

			stockpositiondetail.$update(function() {
				$location.path('stockpositiondetails/' + stockpositiondetail._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};



		$scope.toViewStockpositiondetail = function() {
			$scope.stockpositiondetail = Stockpositiondetails.get( {stockpositiondetailId: $stateParams.stockpositiondetailId} );
			$scope.setFormFields(true);
		};

		$scope.toEditStockpositiondetail = function() {
			$scope.stockpositiondetail = Stockpositiondetails.get( {stockpositiondetailId: $stateParams.stockpositiondetailId} );
			$scope.setFormFields(false);
		};

	}

]);
