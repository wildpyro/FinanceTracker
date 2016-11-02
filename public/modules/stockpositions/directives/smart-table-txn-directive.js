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

			 			var totalSettle = 0,
							totalBook = 0,
							gainSettle = 0,
							gainBook = 0;
							 
						vm.dataCollection = angular.copy(vm.datacollection);

						for (var i = vm.dataCollection.length - 1; i >= 0; i--) {
							var data = vm.dataCollection[i];			

							if (!angular.isDefined(data.type)) {
								console.log('This is bad', data.symbol);
							}	

							if (data.type === 'Sell') {
								gainSettle += data.settle;
								gainBook += data.book;
							}
							else {
								gainSettle += 0;
								gainBook += 0;
							}

							totalSettle += data.settle;
							totalBook += data.book;
						}
						
						vm.length = vm.dataCollection.length;
						vm.totalsettle = Number(totalSettle).toFixed(2);
						vm.totalbook = Number(totalBook).toFixed(2);
						vm.gainloss = gainSettle - gainBook;
						vm.gainlosspct = Number(vm.gainloss/gainBook * 100).toFixed(2);
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
