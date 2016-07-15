'use strict';

// Stockpositiondetails controller
angular.module('stockpositiondetails').controller('StockpositiondetailsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Stockpositiondetails', 'StockpositiondetailsForm', '$state', 
	function($scope, $stateParams, $location, Authentication, Stockpositiondetails, StockpositiondetailsForm, $state) {
		var vm = this,
			searchFor = '';

		this.quote = new Stockpositiondetails(); 
		$scope.authentication = Authentication;
		
		//Set the symbol for navigation 
		vm.symbol = $stateParams.symbol;

		if ($state.is('spd.home')) {
			searchFor = 'quote';
			this.quote = Stockpositiondetails.get({symbol: $stateParams.symbol, searchFor: searchFor});
			$scope.quote1 = StockpositiondetailsForm.getFormFieldsQuote1(true);
			$scope.quote2 = StockpositiondetailsForm.getFormFieldsQuote2(true);
		}
		else if ($state.is('spd.performance')) {
			searchFor = 'performance';
			this.performance = Stockpositiondetails.get({symbol: $stateParams.symbol, searchFor: searchFor});
			$scope.perf1 = StockpositiondetailsForm.getFormFieldsPerf1(true);
		}
		else if ($state.is('spd.fundamentals')) {
			searchFor = 'fundamentals';
			this.fundamentals = Stockpositiondetails.get({symbol: $stateParams.symbol, searchFor: searchFor});
			$scope.fund1 = StockpositiondetailsForm.getFormFieldsFund1(true);
			$scope.fund2 = StockpositiondetailsForm.getFormFieldsFund2(true);
		}

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
