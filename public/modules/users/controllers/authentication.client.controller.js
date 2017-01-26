'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$location', 'Authentication', 'User',
	function($scope, $http, $location, Authentication, User) {

		var vm = this;
		vm.authentication = Authentication;
		this.user = User;

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
			console.log(this.user);
			var response = User.signin({credentials: vm.credentials});
			
			// If successful we assign the response to the global user model
			//$scope.authentication.user = response;
			//$location.path('/');
		};
	}
]);
