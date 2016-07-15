'use strict';

// Stockpositions controller
angular.module('stockpositions').controller('StockpositionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Stockpositions', 
																		 'SmartTableFactory', 'StockpositionsForm', 'AccountTypeService', '$filter',
	function($scope, $stateParams, $location, Authentication, Stockpositions, SmartTableFactory, StockpositionsForm, AccountTypeService, $filter) {
		var vm = this;
		vm.isLoading = false;
		$scope.authentication = Authentication;
		$scope.stockposition = {};
		this.rows = [];
		this.rowsCollection = [];

		function doesMatch(dataToTest) {
			if (angular.isDefined(vm.rowsCollection.accountType) && 
				dataToTest.accountType !== null &&  
				dataToTest.accountType !== vm.rowsCollection.accountType &&
				dataToTest.symbol !== vm.rowsCollection.symbol) {
				return false;
			}
			else {
				return true;
			}
		}

		/*
		* Use prefetched data for this piece. Note that each account has it's own instance here. 
		*/
		this.getData = function(data) {
			if ($location.$$url === '/accounts') {
				if (angular.isDefined(data.stockPositions) && data.stockPositions !== null && data.stockPositions.length > 0) {
					if (this.rowsCollection.length === 0) {
						this.rowsCollection = data.stockPositions;
					}
					else {
						var test = data.stockPositions.filter(doesMatch);

						if (test.length !== 0) {		
							var marketValue = 0;
							//marketValue =+ data.stockPositions.market;
							this.rows.push({accountType: data.accountType[0], data: data.stockPositions});
			        		this.rowsCollection = [].concat(this.rows);						
						}
					}
				}
			}
		};

		this.fetch = function fetch(tableState) {
		    var pagination = tableState.pagination;
		    var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
		    var number = pagination.number || 100;  // Number of entries showed per page.

		    SmartTableFactory.getPage(start, number, tableState, Stockpositions).then(function (result) {

		    	vm.rows.push(result);
        		vm.rowsCollection = [].concat(vm.rows);
				tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
				vm.isLoading = false;
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
				$location.path('stockpositions');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Stockposition
		$scope.remove = function(stockposition) {
			if (stockposition) {
				stockposition = Stockpositions.get({stockpositionId:stockposition._id}, function() {
					stockposition.$remove(function() {
						for (var i = vm.rowsCollection[0].data.length - 1; i >= 0; i--) {
							var row = vm.rowsCollection[0].data[i];	
						}
					});
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

			stockposition.market = stockposition.price * stockposition.shares;

			stockposition.$update(function() {
				$location.path('stockpositions/' + stockposition._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		this.toViewStockposition = function() {
			$scope.stockposition = Stockpositions.get( {stockpositionId: $stateParams.stockpositionId} );
			this.setFormFields(true, true);
		};

		this.toEditStockposition = function() {
			$scope.stockposition = Stockpositions.get( {stockpositionId: $stateParams.stockpositionId} );
			this.setFormFields(false, false);
		};

//Listing functions 
		this.calcMV = function(price,shares) {
			var mv = price * shares;

			vm.cash = '10%';
			vm.fixed = '20%';
			vm.equity = '70%';
			vm.totalmv += mv;

			return mv;
		};

		this.resolveAccountType = function(enumValue) {
			return AccountTypeService.getText(enumValue);
		};

		this.getInstance = function(accountType) {
			for (var i = vm.rowsCollection.length - 1; i >= 0; i--) {
				var row = vm.rowsCollection[i];
				if (row.accountType === accountType[0]) {
					
					this.balance += row.data[0].market;
					return row.data;
				}
				else {
					this.balance = 0;	
				}
			}
		};

		this.calcGainLoss = function(price, shares, book) {			
			var value = ((price * shares) - book).toFixed(2);
			return value;
		};

		this.stockUp = function(price, shares, book) {

			var value = ((price * shares) - book).toFixed(2);

			if (value >= 0) {
				return true;
			}

			return false;
		};
	}

]);
