'use strict';
(function() {
 
 	var stSummary = function() {
 		
 		var controller = function() {

 			var vm = this;

			init();

 			function init() {
 				vm.datacollection = angular.copy(vm.datacollection);
 			}

 		};

		return {
			scope: {
				datacollection: '=',
				cash: '=',
				fixed: '=',
				equity: '='
			}, 
			controller: controller,
			controllerAs: 'vm',
			bindToController: true,
			templateUrl: 'modules/core/views/stsummary.client.view.html'
		};
 	};

	angular.module('core').directive('stSummary', stSummary);

}());