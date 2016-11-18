'use strict';
(function() {

    var searchWatchModel = function() {

        var link = function ($scope, ele, attr, ctrl) {
            var table = ctrl;

            //TODO have the watch be dynamic based on what field we are search for. 

			$scope.$watch(function () { 
					return $scope.ctrl.fab.showDrip; 
			    },
                function (val) {
                    ctrl.search(val, 'showDrip');
                });
        };

        return {
            require: '^stTable',
/*          Remove the isolate scope so I don't get the multidir error   
            scope: {
                searchWatchModel: '='
            },
*/           
            link: link
        };
    };

    angular.module('core').directive('searchWatchModel', searchWatchModel);

}());
