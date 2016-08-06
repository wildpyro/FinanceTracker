'use strict';

// Stockpositions controller
angular.module('stockpositions').controller('TxnsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Txns', 
																		 'SmartTableFactory', '$filter', 'TxnsForm', 'TxnTypesService',
	function($scope, $stateParams, $location, Authentication, Txns, SmartTableFactory, $filter, TxnsForm, TxnTypesService) {
		var vm = this;
		vm.isLoading = false;
		$scope.authentication = Authentication;
		this.txns = {};
		this.rows = [];
		this.rowsCollection = [];
		this.formFields = TxnsForm.getFormFields1();
		vm.resetTable = true;
		$scope.txn = {};
	    
	    vm.model = {};		
	    vm.options = {formState: {}};		

//Table operations 
		//Fetch data from server 
		this.fetch = function fetch(tableState) {
		    $scope.isLoading = true;

		    var pagination = tableState.pagination;
		    var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
		    var number = pagination.number || 10;  // Number of entries showed per page.

		    SmartTableFactory.getPage(start, number, tableState, Txns).then(function (result) {

		    	if (vm.rowsCollection.size !== 1) {
		    		vm.rows = result;
		    		vm.rowsCollection = vm.rowsCollection.concat(result);
		    	} 

				tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
				vm.isLoading = false;
		    });
		};

//Form operations 
		this.add = function addTxn() {
			var txn = new Txns(this.model);

			tableAddItem(txn);

			if (vm.resetTable) {
				vm.options.resetModel();
			}
		};

//Table Operations 
		function serverDelete(row) {
			var txn = new Txns(row);
			//This wasn't triggering the correct route without the txnid assignment. 
			//DELETE /txns/57629c8e35289083097d2b52 it was looking like /txns?TxnId=57629c8e35289083097d2b52
			txn.$remove({txnId:txn._id}, function(response) {
				vm.sucess = 'record deleted';
			}, function(errorResponse) {
				vm.error = errorResponse.data.message;
			});
		}

		function serverSave(row) {
			var txn = new Txns(row);
			txn.$save(function(response) {
				vm.sucess = 'record saved';
			}, function(errorResponse) {
				vm.error = errorResponse.data.message;
			});
		}

	    //add to viewed collection 
	    function tableAddItem(txn) {
	        vm.rowsCollection[0].data.push(txn);
	    }

		//Attempt a delete to server 
		this.tableDelete = function() {
			for (var i = vm.rowsCollection[0].data.length - 1; i >= 0; i--) {
				var row = vm.rowsCollection[0].data[i];
				
				if (!angular.isDefined(row._id)) {
					serverDelete(row);	
				}
			}
		};		

		//Attempt to save to server 
		this.tableSave = function() {
			for (var i = vm.rowsCollection[0].data.length - 1; i >= 0; i--) {
				var row = vm.rowsCollection[0].data[i];
					
				if (!angular.isDefined(row._id)) {
					serverSave(row);	
				}
			}
		};		

		//Reset to original source
		this.tableReset = function() {
			vm.rowsCollection[0] = vm.rows;
		};		

		//Remove the row from either the view or the view & server 
	    this.tableRemoveItem = function tableRemoveItem(row) {
	        var index = vm.rowsCollection[0].data.indexOf(row);

	        if (index !== -1) {

	        	if (angular.isDefined(row._id)) {
	        		serverDelete(row);
	        		vm.rowsCollection[0].data.splice(index, 1);
	        	}
	        	else {
	            	vm.rowsCollection[0].data.splice(index, 1);
	        	}
	        }
	    };
	    
//Listing Operations  
		this.totalCost = function(price,commission,shares) {

			if (!angular.isDefined(commission)) {
				commission = 0;
			}	

			var total = Number(price) * Number(shares) + Number(commission);
			return total;
		};

		this.avgCost = function(price,commission,shares) {

			if (!angular.isDefined(commission)) {
				commission = 0;
			}	

			var avg = (Number(price) * Number(shares) + Number(commission)) / Number(shares);
			return avg;
		};

		this.resolveTxnType = function(enumValue) {
			return TxnTypesService.getText(enumValue);
		};
	}
]);
