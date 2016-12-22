'use strict';
(function() {
 
 	var stIncomeSummary = function() {
 		
 		var controller = function($scope) {

 			var vm = this;

			$scope.$watch( function () { 
					return $scope.vm.datacollection; 
			    }, 
			    function () {
					if (angular.isDefined(vm.datacollection)) {

			 			var totalSettle = 0;
							 
						vm.dataCollection = angular.copy(vm.datacollection);

						for (var i = vm.dataCollection.length - 1; i >= 0; i--) {
							var data = vm.dataCollection[i];				

							totalSettle += data.settle;
						}
						
						vm.length = vm.dataCollection.length;
						vm.totalsettle = Number(totalSettle).toFixed(2);
					}
			    } 
			); 			

 		};

		return {
			restrict: 'EA', 
			scope: {datacollection: '='},
			controller: controller,
			controllerAs: 'vm',
			bindToController: true,
			templateUrl: 'modules/stockpositions/views/st-income-summary.client.view.html'
		};
 	};

	angular.module('core').directive('stIncomeSummary', stIncomeSummary);

}());
