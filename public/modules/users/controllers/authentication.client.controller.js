'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication', 'UserFactory',
	function($scope, $http, $location, Authentication, UserFactory) {
		var vm = this;
		vm.authentication = Authentication;

		// If user is signed in then redirect back home
		if (vm.authentication.user) {
			$location.path('/');
		}

		this.signup = function() {
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

		this.signin = function() {
			var response = UserFactory.signin(vm.credentials);
	
			// If successful we assign the response to the global user model
			//vm.authentication.user = response;
		};
	}
]);
