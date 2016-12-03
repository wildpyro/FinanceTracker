'use strict';

angular.module('stockpositiondetails').directive('quoteDirective', [function() {

	return {
		restrict: 'E',
		controllerAs: 'StockpositiondetailsController as ctrl',
		templateUrl: 'modules/stockpositiondetails/directives/quote-directive-template.html',
        scope: {
            symbol: '=symbol'
        }
	};
}]);
