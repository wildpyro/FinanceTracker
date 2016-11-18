'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {

		var vm = this;
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) {
			$location.path('/');
		}

		vm.signup = function() {
			$http.post('/auth/signup', vm.credentials)
			.success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			})
			.error(function(response) {
				vm.error = response.message;
			});
		};

		vm.signin = function() {
			$http.post('/auth/signin', vm.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;
				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				vm.error = response.message;
			});
		};
	}
]);
