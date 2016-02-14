'use strict';

// Networths controller
angular.module('networths').controller('NetworthsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Networths', 'TableSettings', 'NetworthsForm',
	function($scope, $stateParams, $location, Authentication, Networths, TableSettings, NetworthsForm ) {
		$scope.authentication = Authentication;
		$scope.tableParams = TableSettings.getParams(Networths);
		$scope.networth = {};

		$scope.setFormFields = function(disabled) {
			$scope.formFields = NetworthsForm.getFormFields(disabled);
		};


		// Create new Networth
		$scope.create = function() {
			var networth = new Networths($scope.networth);

			// Redirect after save
			networth.$save(function(response) {
				$location.path('networths/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Networth
		$scope.remove = function(networth) {

			if ( networth ) {
				networth = Networths.get({networthId:networth._id}, function() {
					networth.$remove();
					$scope.tableParams.reload();
				});

			} else {
				$scope.networth.$remove(function() {
					$location.path('networths');
				});
			}

		};

		// Update existing Networth
		$scope.update = function() {
			var networth = $scope.networth;

			networth.$update(function() {
				$location.path('networths/' + networth._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};



		$scope.toViewNetworth = function() {
			$scope.networth = Networths.get( {networthId: $stateParams.networthId} );
			$scope.setFormFields(true);
		};

		$scope.toEditNetworth = function() {
			$scope.networth = Networths.get( {networthId: $stateParams.networthId} );
			$scope.setFormFields(false);
		};

	}

]);
