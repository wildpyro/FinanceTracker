'use strict';

angular.module('core').directive('stSummary', [function() {

	return {
		restrict: 'E',
		controller: 'StockpositionsController',
		template: '<div>total:{{balance}}</div>',
		scope: {},
		link: function (scope, element, attr, ctrl) {
			scope.$watch(ctrl.rows, function(val) {
				console.log(ctrl.rows);
				console.log(val);
				scope.balance = 10; //(val || []).length;
			});
		}
	};
}]);