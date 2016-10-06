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

			 			var totalsettle = 0,
							totalbook = 0;
							 
						vm.dataCollection = angular.copy(vm.datacollection);

						for (var i = vm.dataCollection.length - 1; i >= 0; i--) {
							var data = vm.dataCollection[i];
							//console.log(data);						

							if (!angular.isDefined(data.type)) {
								console.log('This is bad', data.symbol);
							}

							totalsettle += data.settle;
							totalbook += data.book;
						}
						
						vm.length = vm.dataCollection.length;
						vm.totalsettle = Number(totalsettle).toFixed(2);
						vm.totalbook = Number(totalbook).toFixed(2);
						vm.gainloss = vm.totalsettle - vm.totalbook;
						vm.gainlosspct = Number(vm.gainloss/totalbook * 100).toFixed(2);
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
			templateUrl: 'modules/stockpositions/views/sttxnsummary.client.view.html'
		};
 	};

	angular.module('core').directive('stTxnSummary', stTxnSummary);

}());