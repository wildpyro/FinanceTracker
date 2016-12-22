'use strict';

// Stockpositions controller
angular.module('stockpositions').controller('IncomeController', ['$scope', '$stateParams', '$location', 'Authentication', 'Income', 
															   'SmartTableFactory', '$filter',   
	function($scope, $stateParams, $location, Authentication, Income, SmartTableFactory, $filter) {
		var vm = this;
		
		$scope.authentication = Authentication;

		this.safeRows = [];
		this.displayRowsCollection = [];

		vm.isLoading = false;
		vm.resetTable = false;
	    vm.model = {};
	    vm.options = {formState: {}};		

//Table operations 
		//Fetch data from server 
		this.fetch = function fetch(tableState) {
		    $scope.isLoading = true;

		    var pagination = tableState.pagination;
		    var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
		    var number = pagination.number || 10;  // Number of entries showed per page.

			//console.log(tableState);

		    SmartTableFactory.getPage(start, number, tableState, Income).then(function (result) {
				vm.safeRows = [];
				vm.displayRowsCollection = []; 
		    	vm.safeRows= result.data;
        		vm.displayRowsCollection = vm.displayRowsCollection.concat(vm.safeRows);
				
				tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
				vm.isLoading = false;
		    });
		};				
    }]
);
