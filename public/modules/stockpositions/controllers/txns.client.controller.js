'use strict';

// Stockpositions controller
angular.module('stockpositions').controller('TxnsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Txns', 
																		 'SmartTableFactory', '$filter', 'TxnsForm', 
	function($scope, $stateParams, $location, Authentication, Txns, SmartTableFactory, $filter, TxnsForm) {
		var vm = this;
		vm.isLoading = false;
		$scope.authentication = Authentication;
		this.txns = {};
		this.rows = [];
		this.rowsCollection = [];
		this.formFields = TxnsForm.getFormFields();
	    
	    vm.model = {};		
	    vm.options = {formState: {}};		

		this.fetch = function fetch(tableState) {
		    $scope.isLoading = true;

		    var pagination = tableState.pagination;
		    var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
		    var number = pagination.number || 10;  // Number of entries showed per page.

		    SmartTableFactory.getPage(start, number, tableState, Txns).then(function (result) {

		    	vm.rows.push(result);
        		vm.rowsCollection = [].concat(vm.rows);
				tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
				vm.isLoading = false;
		    });
		};

		this.add = function addTxn() {
			var txn = new Txns(this.model);

			console.log(this.model);

			// Redirect after save
			txn.$save(function(response) {
				console.log('success');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Update existing Txn
		//Probably need a full table update 
		this.update = function(txn) {
			
			/*stockposition.$update(function() {
				$location.path('stockpositions/' + stockposition._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});*/
		};

//Listing functions 
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
	}
]);
