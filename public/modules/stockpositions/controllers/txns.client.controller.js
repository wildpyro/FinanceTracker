'use strict';

// Stockpositions controller
angular.module('stockpositions').controller('TxnsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Txns', 
															   'SmartTableFactory', '$filter', 'TxnsForm', 'TxnTypesService', 'moment', '$timeout', '$mdDialog',  
	function($scope, $stateParams, $location, Authentication, Txns, SmartTableFactory, $filter, TxnsForm, TxnTypesService, moment, $timeout, $mdDialog) {
		var vm = this;
		
		$scope.authentication = Authentication;
		$scope.txn = {};
		
		this.txns = {};
		this.safeRows = [];
		this.displayRowsCollection = [];
		this.formFields = TxnsForm.getFormFields1();
		
		vm.isLoading = false;
		vm.resetTable = false;
	    vm.model = {};
	    vm.options = {formState: {}};

		//Table row filters 
		vm.filter = {};
		vm.filter.toDate = moment().toDate();
		vm.filter.fromDate = moment().add(-1, 'year').toDate();

		//fab config
		vm.fab = {};
		vm.fab.isOpen = false;
		vm.fab.tooltipVisible = false;
		vm.fab.showDrip = false;

		// On opening, add a delayed property which shows tooltips after the speed dial has opened
		// so that they have the proper position; if closing, immediately hide the tooltips
		$scope.$watch('vm.fab.isOpen', function (isOpen) {
			if (isOpen) {
				$timeout(function () {
					vm.fab.tooltipVisible = isOpen;
				}, 600);
			} 
			else {
				vm.fab.tooltipVisible = isOpen;
			}
		});

		this.toggle = function() {
			vm.fab.showDrip = !vm.fab.showDrip;
		};

//Table operations 
		//Fetch data from server 
		this.fetch = function fetch(tableState) {
		    $scope.isLoading = true;

		    var pagination = tableState.pagination;
		    var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
		    var number = pagination.number || 10;  // Number of entries showed per page.

			//console.log(tableState);

		    SmartTableFactory.getPage(start, number, tableState, Txns).then(function (result) {
				vm.safeRows = [];
				vm.displayRowsCollection = []; 
		    	vm.safeRows= result.data;
        		vm.displayRowsCollection = vm.displayRowsCollection.concat(vm.safeRows);
				
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
	        vm.displayRowsCollection.push(txn);
	    }

		//Attempt a delete to server 
		this.tableDelete = function() {
			for (var i = vm.displayRowsCollection.length - 1; i >= 0; i--) {
				
				//console.log(vm.displayRowsCollection);
				var row = vm.displayRowsCollection[i];
				
				if (!angular.isDefined(row._id)) {
					serverDelete(row);	
				}
			}
		};		

		//Attempt to save to server 
		this.tableSave = function() {
			for (var i = vm.displayRowsCollection.length - 1; i >= 0; i--) {

				var row = vm.displayRowsCollection[i];
					
				if (!angular.isDefined(row._id)) {
					serverSave(row);	
				}
			}
		};		

		//Reset to original source
		this.tableReset = function() {
			vm.displayRowsCollection = vm.rows;
		};		

		//Remove the row from either the view or the view & server 
	    this.tableRemoveItem = function tableRemoveItem(row) {
	        var index = vm.displayRowsCollection.indexOf(row);

	        if (index !== -1) {

	        	if (angular.isDefined(row._id)) {
	        		serverDelete(row);
	        		vm.displayRowsCollection.splice(index, 1);
	        	}
	        	else {
	            	vm.displayRowsCollection.splice(index, 1);
	        	}
	        }
	    };
	    
//Listing Operations  
		this.resolveTxnType = function(enumValue) {
			return TxnTypesService.getText(enumValue);
		};

		this.colour = function(value) {
			if (!angular.isUndefined(value)) {	
				if (value.substr(0,1) === 'G') {
					return true; 
				}
				
				return false;
			}
		};
	}
]);
