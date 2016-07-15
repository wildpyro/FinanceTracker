'use strict';

angular.module('stockpositions').controller('quoteAccordionController', ['$scope', 'StockpositiondetailsForm', function($scope, StockpositiondetailsForm) {
	var vm = this;

	this.formFields1 = StockpositiondetailsForm.getFormFields1(true);
	this.formFields2 = StockpositiondetailsForm.getFormFields2(true);


}]);