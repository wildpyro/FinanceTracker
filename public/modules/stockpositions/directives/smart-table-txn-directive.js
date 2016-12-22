'use strict';
(function() {
 
 	var stTxnSummary = function() {
 		
 		var controller = function($scope) {

 			var vm = this;

			$scope.$watch( function () { 
					return $scope.vm.datacollection; 
			    }, 
			    function () {
					if (angular.isDefined(vm.datacollection)) {
						vm.dataCollection = angular.copy(vm.datacollection);

						var totalSettle = 0,
							dollarChange = 0,
							totalCommission = 0;

						for (var i = vm.dataCollection.length - 1; i >= 0; i--) {
							var data = vm.dataCollection[i];			

							if (!angular.isDefined(data.type)) {
								console.log('This is bad', data.symbol);
							}	

							if (data.type === 'Sell') {
								dollarChange -= data.settle;
							}
							else {
								dollarChange += data.settle;
							}

							totalSettle += data.settle;
							totalCommission += data.commission;
						}
						
						vm.length = vm.dataCollection.length;
						vm.totalSettle = totalSettle;
						vm.dollarChange = dollarChange;
						vm.totalCommission = totalCommission; 
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
			templateUrl: 'modules/stockpositions/views/sttxnsummary.client.view.html'
		};
 	};

	angular.module('core').directive('stTxnSummary', stTxnSummary);

}());
