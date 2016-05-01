'use strict';

// Stockpositiondetails controller
angular.module('stockpositiondetails').controller('StockpositiondetailsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Stockpositiondetails', 'StockpositiondetailsForm', '$state',
	function($scope, $stateParams, $location, Authentication, Stockpositiondetails, StockpositiondetailsForm, $state) {
		var self = this;
		$scope.authentication = Authentication;
		$scope.stockpositiondetail = {};

		//Set the symbol for navigation 
		this.symbol = $stateParams.symbol;

		var searchFor = '';

		if ($state.is('spd.home')) {
			searchFor = 'quote';
		}
		else if ($state.is('spd.performance')) {
			searchFor = 'performance';
		}
		else if ($state.is('spd.fundamentals')) {
			searchFor = 'fundamentals';
		}
			
		this.stockpositiondetail = Stockpositiondetails.get({symbol: this.symbol, searchFor: searchFor});

		$scope.setFormFields = function(disabled) {
			$scope.formFields = StockpositiondetailsForm.getFormFields(disabled);
		};



	}

]);
