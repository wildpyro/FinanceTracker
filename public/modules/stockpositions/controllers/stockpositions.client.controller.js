'use strict';

// Stockpositions controller
angular.module('stockpositions').controller('StockpositionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Stockpositions', 
																		 'SmartTableFactory', 'StockpositionsForm', 'AccountTypeService', '$filter',
	function($scope, $stateParams, $location, Authentication, Stockpositions, SmartTableFactory, StockpositionsForm, AccountTypeService, $filter) {
		var self = this;
		self.isLoading = false;
		$scope.authentication = Authentication;
		$scope.stockposition = {};
		this.test = [];
		this.rows = [];
		this.rowsCollection = [];

		/*
		* This only works for non-async calls. Calling this from outside the table create as I don't want this promise based. 
		*/
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
						var marketValue = 0;
						//marketValue =+ data.stockPositions.market;
						//console.log(data.stockPositions);
						this.rows.push({accountType: data.accountType[0], data: data.stockPositions});
		        		this.rowsCollection = [].concat(this.rows);						
		        		this.test.push(data.stockPositions);
					}
				}
			}
		};

		this.fetch = function fetch(tableState) {
		    $scope.isLoading = true;

		    var pagination = tableState.pagination;
		    var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
		    var number = pagination.number || 10;  // Number of entries showed per page.

		    SmartTableFactory.getPage(start, number, tableState, Stockpositions).then(function (result) {

		    	self.rows.push(result);
        		self.rowsCollection = [].concat(self.rows);
				tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
				self.isLoading = false;
		    });
		};

//Single Record functions//
		this.setFormFields = function(disabled, isAdd) {
			$scope.formFields = StockpositionsForm.getFormFields(disabled, isAdd);
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
					//this.tableParams.reload();
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

		this.toViewStockposition = function() {
			$scope.stockposition = Stockpositions.get( {stockpositionId: $stateParams.stockpositionId} );
			console.log('got here');
			this.setFormFields(true, true);
		};

		this.toEditStockposition = function() {
			$scope.stockposition = Stockpositions.get( {stockpositionId: $stateParams.stockpositionId} );
			console.log($scope.stockposition);
			this.setFormFields(false, false);
		};

//Listing functions 
		this.calcMV = function(price,shares) {
			var mv = price * shares;
			return mv;
		};

		this.resolveAccountType = function(enumValue) {
			return AccountTypeService.getText(enumValue);
		};

		this.getInstance = function(accountType) {
			for (var i = self.rowsCollection.length - 1; i >= 0; i--) {
				var row = self.rowsCollection[i];
				if (row.accountType === accountType[0]) {
					
					this.balance += row.data[0].market;
					return row.data;
				}
				else {
					this.balance = 0;	
				}
			}
		};
	}

]);
