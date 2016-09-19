'use strict';
(function() {
 
 	var stSummary = function() {
 		
 		var controller = function($scope) {

 			var vm = this;

			$scope.$watch( function () { 
					//return  $scope.$parent.ctrl.displayRowsCollection;
					return $scope.vm.datacollection; 
			    }, 
			    function () {

					if (angular.isDefined(vm.datacollection)) {

			 			var equity = 0,
			 				cash = 0,
			 				fixed = 0,
			 				totalmv = 0;
							 
						vm.dataCollection = angular.copy(vm.datacollection);
						vm.length = vm.dataCollection.length;

						for (var i = vm.dataCollection.length - 1; i >= 0; i--) {
							var data = vm.dataCollection[i];
							//console.log(data);						

							if (!angular.isDefined(data.type)) {
								console.log('This is bad', data.symbol);
							}

							if (data.type === 'cash') {
								//vm.cash += data.market;	
								cash += data.market;	
							}
							else if (data.type === 'fixed') {
								//vm.fixed += data.market;
								fixed += data.market;	
							}
							else if (data.type === 'equity') {
								//vm.equity += data.market;
								equity += data.market;	
							}

							totalmv += data.market;
						}

						vm.cash = Number(cash/totalmv * 100).toFixed(2);
						vm.equity = Number(equity/totalmv * 100).toFixed(2);
						vm.fixed = Number(fixed/totalmv * 100).toFixed(2);						
						vm.totalmv = Number(totalmv).toFixed(2);

						// If the amount goes over 100 than the progress bar fails. Allocate the rounding to equity which is always the largest.
						if (Number(vm.cash) + Number(vm.equity) + Number(vm.fixed) >= 100) {
							
							vm.equity = 100 - vm.cash - vm.fixed; 
						}
					}
			    } 
			); 			

 		};

		return {
			restrict: 'EA', 
			//scope: true,
			scope: {datacollection: '='},
			controller: controller,
			controllerAs: 'vm',
			bindToController: true,
			templateUrl: 'modules/core/views/stsummary.client.view.html'
		};
 	};

	angular.module('core').directive('stSummary', stSummary);

}());