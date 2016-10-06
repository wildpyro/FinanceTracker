'use strict';

// networth controller
angular.module('networth').controller('networthController', ['$scope', '$stateParams', '$location', 'Authentication', 'networth', 'TableSettings', 'networthForm',
	function($scope, $stateParams, $location, Authentication, Networth, TableSettings, networthForm ) {
		$scope.authentication = Authentication;
		$scope.tableParams = TableSettings.getParams(Networth);
		$scope.networth = {};

		$scope.setFormFields = function(disabled) {
			$scope.formFields = networthForm.getFormFields(disabled);
		};


		// Create new Networth
		$scope.create = function() {
			var networth = new Networth($scope.networth);

			// Redirect after save
			networth.$save(function(response) {
				$location.path('networth/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Networth
		$scope.remove = function(networth) {

			if ( networth ) {
				networth = networth.get({networthId:networth._id}, function() {
					networth.$remove();
					$scope.tableParams.reload();
				});

			} else {
				$scope.networth.$remove(function() {
					$location.path('networth');
				});
			}

		};

		// Update existing Networth
		$scope.update = function() {
			var networth = $scope.networth;

			networth.$update(function() {
				$location.path('networth/' + networth._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.toViewNetworth = function() {
			$scope.networth = Networth.get( {networthId: $stateParams.networthId} );
			$scope.setFormFields(true);
		};

		$scope.toEditNetworth = function() {
			$scope.networth = Networth.get( {networthId: $stateParams.networthId} );
			$scope.setFormFields(false);
		};

	}

]);
