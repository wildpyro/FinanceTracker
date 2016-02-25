'use strict';

// Stockpositions controller
angular.module('stockpositions').controller('StockpositionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Stockpositions', 
																		 'TableSettings', 'StockpositionsForm', 'AccountTypeService', 
	function($scope, $stateParams, $location, Authentication, Stockpositions, TableSettings, StockpositionsForm, AccountTypeService ) {
		$scope.authentication = Authentication;
		$scope.stockposition = {};
		
		//The table params carries through the $scope from account, this needs to be isolate scope.  
		$scope.getData = function(data) {
			if ($location.$$url === '/accounts') {
				$scope.tableParams = TableSettings.setData(data);
			}
			else {
				$scope.tableParams = TableSettings.getParams(Stockpositions);
			}			
		};
		
//Single Record functions
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
			} 
			else {
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

//Listing functions 
		$scope.calcMV = function(price,shares) {
			return Math.round(price * shares,4);
		};

		$scope.resolveAccountType = function(enumValue) {
			return AccountTypeService.getText(enumValue);
		};
	}

]);
