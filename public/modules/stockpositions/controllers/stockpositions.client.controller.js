'use strict';

// Stockpositions controller
angular.module('stockpositions').controller('StockpositionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Stockpositions', 
																		 'TableSettings', 'StockpositionsForm', 'AccountTypeService', 
	function($scope, $stateParams, $location, Authentication, Stockpositions, TableSettings, StockpositionsForm, AccountTypeService) {
		var self = this;
		$scope.authentication = Authentication;
		$scope.stockposition = {};
		this.tableParams = TableSettings.getInstance();
		this.test = [];
		var tableParamsArray = [];
		this.rowCollection = [];

		this.getData = function(data) {
			if ($location.$$url === '/accounts') {
				if (angular.isDefined(data.stockPositions) && data.stockPositions !== null && data.stockPositions.length > 0) {

					function doesMatch(dataToTest) {
						if (angular.isDefined(data.stockPositions.accountType) && 
							data.stockPositions.accountType !== null &&  
							dataToTest.accountType !== data.stockPositions.accountType[0] &&
							dataToTest.data.symbol !== data.stockPositions.symbol) {
							return false;
						}
						else {
							return true;
						}
					}

					var test2 = this.test.filter(doesMatch);
					if (test2.length === 0) {		
						this.rowCollection.push({accountType: data.accountType[0], data: data.stockPositions});
						this.test.push(data.stockPositions);
					}
				}
			}
			else {
				this.tableParams = new TableSettings(Stockpositions);
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
					this.tableParams.reload();
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
		this.calcMV = function(price,shares) {
			return Math.round(price * shares,4);
		};

		this.resolveAccountType = function(enumValue) {
			return AccountTypeService.getText(enumValue);
		};

		this.getAccountType = function(enumText) {
			return 0;
		};

		this.getInstance = function(accountType) {
			for (var i = this.rowCollection.length - 1; i >= 0; i--) {
				if (this.rowCollection[i].accountType === accountType[0]) {
					return this.rowCollection[i].data;
				}
			}
		};		
	}

]);
