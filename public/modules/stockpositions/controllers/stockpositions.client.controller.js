'use strict';

// Stockpositions controller
angular.module('stockpositions').controller('StockpositionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Stockpositions', 
																		 'TableSettings', 'StockpositionsForm', 'AccountTypeService', 
	function($scope, $stateParams, $location, Authentication, Stockpositions, TableSettings, StockpositionsForm, AccountTypeService ) {
		$scope.authentication = Authentication;
		$scope.tableParams = TableSettings.getParams(Stockpositions);
		$scope.stockposition = {};
		$scope.AccountType = AccountTypeService;

		$scope.setFormFields = function(disabled) {
			$scope.formFields = StockpositionsForm.getFormFields(disabled);
		};


		// Create new Stockposition
		$scope.create = function() {
			var stockposition = new Stockpositions($scope.stockposition);

			stockposition.market = stockposition.price * stockposition.shares;

			// Redirect after save
			stockposition.$save(function(response) {
				$location.path('stockpositions/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Stockposition
		$scope.remove = function(stockposition) {

			if ( stockposition ) {
				stockposition = Stockpositions.get({stockpositionId:stockposition._id}, function() {
					stockposition.$remove();
					$scope.tableParams.reload();
				});

			} else {
				$scope.stockposition.$remove(function() {
					$location.path('stockpositions');
				});
			}

		};

		// Update existing Stockposition
		$scope.update = function() {
			var stockposition = $scope.stockposition;

			stockposition.$update(function() {
				$location.path('stockpositions/' + stockposition._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.toViewStockposition = function() {
			$scope.stockposition = Stockpositions.get( {stockpositionId: $stateParams.stockpositionId} );
			$scope.setFormFields(true);
		};

		$scope.toEditStockposition = function() {
			$scope.stockposition = Stockpositions.get( {stockpositionId: $stateParams.stockpositionId} );
			$scope.setFormFields(false);
		};

		$scope.calcMV = function(price,shares) {
			return Math.round(price * shares,4);
		};

		// Create new Stockposition
		$scope.listByAccountType = function() {
			//Stockpositions.query();			

			// Redirect after save
			
		};		
	}

]);
