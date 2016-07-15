'use strict';
(function() {

  var ngReallyClick = ['$uibModal', function($uibModal) {

    var ModalInstanceCtrl = function($scope, $uibModalInstance) {
      $scope.ok = function() {
        $uibModalInstance.close();
      };

      $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
      };
    };

    return {
      restrict: 'A',
      scope: {
        ngReallyClick: '&'
      },
      link: function(scope, element, attrs) {

        element.bind('click', function() {
          var message = attrs.ngReallyMessage || 'Are you sure ?';

          var modalHtml = '<div class="modal-body">' + message + '</div>';
          modalHtml += '<div class="modal-footer"><button class="btn btn-primary" ng-click="ok()">OK</button><button class="btn btn-warning" ng-click="cancel()">Cancel</button></div>';

          var modalInstance = $uibModal.open({
            template: modalHtml,
            controller: ModalInstanceCtrl
          });

          modalInstance.result.then(function() {
            scope.ngReallyClick();
          }, function() {
            //Modal dismissed
          });

        });

      }

    };
  }];

  angular.module('core').directive('ngReallyClick', ngReallyClick);

}());