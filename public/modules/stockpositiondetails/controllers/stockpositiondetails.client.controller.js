'use strict';

// Stockpositiondetails controller
angular.module('stockpositiondetails').controller('StockpositiondetailsController', ['$scope', 'Authentication', 'Stockpositiondetails', 'StockpositiondetailsForm', 
	function($scope, Authentication, Stockpositiondetails, StockpositiondetailsForm) {
		var vm = this,
			searchFor = '';

		vm.quote = new Stockpositiondetails();
		vm.screen = 'base'; 
		$scope.authentication = Authentication;

		$scope.$watch( function () {
			return vm.screen;
		},
		function () {

			if (vm.screen === 'base') {
				searchFor = 'quote';
				var res = Stockpositiondetails.get({symbol: $scope.symbol});
				console.log(res);
				vm.quoteResponse = res;

				vm.quote1 = StockpositiondetailsForm.getFormFieldsQuote1(true);
				vm.quote2 = StockpositiondetailsForm.getFormFieldsQuote2(true);
				vm.quote3 = StockpositiondetailsForm.getFormFieldsQuote3(true);
				vm.perf1 = StockpositiondetailsForm.getFormFieldsPerf1(true);
				vm.fund1 = StockpositiondetailsForm.getFormFieldsFund1(true);
				vm.fund2 = StockpositiondetailsForm.getFormFieldsFund2(true);								
			}
		});

		this.colour = function(value) {
			if (!angular.isUndefined(value)) {	
				if (value.substr(0,1) === '+') {
					return true; 
				}
				
				return false;
			}
		};
	}

]);
