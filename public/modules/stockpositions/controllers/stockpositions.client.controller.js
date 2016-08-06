'use strict';

// Stockpositions controller
angular.module('stockpositions').controller('StockpositionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Stockpositions', 
																		 'SmartTableFactory', 'StockpositionsForm', 'AccountTypeService', '$filter', 'PositionsTypesService', 
	function($scope, $stateParams, $location, Authentication, Stockpositions, SmartTableFactory, StockpositionsForm, AccountTypeService, $filter, PositionsTypesService) {
		var vm = this;
		vm.isLoading = false;
		$scope.authentication = Authentication;
		vm.stockposition = {};
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
							this.rows.push({accountType: data.accountType, data: data.stockPositions});
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

				//Set the data collection for the directive 
				$scope.data = vm.rowsCollection[0].data;
		    });
		};

		this.getRows = function() {
			return vm.rowsCollection[0].data;
		};

//Single Record functions//
		this.setFormFields = function(disabled, isAdd) {
			vm.formFields = StockpositionsForm.getFormFields(disabled, isAdd);
		};

		// Create new Stockposition
		this.create = function() {
			var stockposition = new Stockpositions(vm.stockposition);

			stockposition.market = stockposition.price * stockposition.shares;
			// Redirect after save
			stockposition.$save(
				function(response) {
					$location.path('stockpositions');
				}, 
				function(errorResponse) {
					vm.error = errorResponse.data.message;
				}
			);
		};

		// Remove existing Stockposition
		this.remove = function(stockposition) {
			if (stockposition) {
				stockposition = Stockpositions.get({stockpositionId:stockposition._id}, function() {
					stockposition.$remove(
						function(response) {
							for (var i = vm.rowsCollection[0].data.length - 1; i >= 0; i--) {
								var row = vm.rowsCollection[0].data[i];	
							}
						},
						function(errorResponse) {
							console.log('delete failed');
							vm.error = errorResponse.data.message;
							console.log(vm.error);
						}
					);
				});
			} 
			else {
				vm.stockposition.$remove(function() {
					$location.path('stockpositions');
				});
			}
		};

		// Update existing Stockposition
		this.update = function() {
			var stockposition = vm.stockposition;
			stockposition.market = stockposition.price * stockposition.shares;

			stockposition.$update(function() {
				//$location.path('stockpositions/' + stockposition._id);
				$location.path('stockpositions');
			}, function(errorResponse) {
				vm.error = errorResponse.data.message;
			});
		};

		this.toViewStockposition = function() {	
			Stockpositions.get({stockpositionId: $stateParams.stockpositionId}, function(stockposition) {
				vm.stockposition = stockposition;
				vm.setFormFields(true, true);
			});
		};

		this.toEditStockposition = function() {
			Stockpositions.get({stockpositionId: $stateParams.stockpositionId}, function(stockposition) {
				vm.stockposition = stockposition;
				vm.setFormFields(false, false);
			});			
		};

//Listing functions 
		this.calcMV = function(positionType, price, shares) {
			var mv = price * shares;
			return mv;
		};

		this.resolveAccountType = function(enumValue) {
			return AccountTypeService.getText(enumValue);
		};

		this.getInstance = function(accountType) {

			for (var i = vm.rowsCollection.length - 1; i >= 0; i--) {
				var row = vm.rowsCollection[i];


				if (row.accountType === accountType && angular.isDefined(row.data)) {
					//TODO the rowCollection contains way too many rows 
					//console.log(row, accountType);
					vm.balance += row.market;
					return row.data;
				}
				else {
					vm.balance = 0;	
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
