'use strict';

angular.module('stockpositions').directive('quoteAccordion', [function() {

	return {
		restrict: 'E',
		controllerAs: 'quoteAccordionController as ctrl',
		template: 'quote-accordion-directive-template',
		scope: {},
		link: function (scope, element, attr, ctrl) {
			scope.$watch(ctrl.rows, function(val) {

			});
		}
	};
}]);