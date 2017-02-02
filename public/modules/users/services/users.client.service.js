'use strict';

angular.module('users').factory('UserFactory', ['$http', '$resource', '$location',
	function($http, $resource, $location) {
		var factory = $resource(
			'users', 
			{},
			{
				update: {
					method: 'PUT'
				}
			}
		);
		
		factory.signin = function(credentials) {

			$http.post('/auth/signin', credentials)
			.then(function(response) {
					$location.path('/');
					return response;
				}
			)
			.catch(
				function(response) {
					return response;
				}
			);
		};

		return factory;
	}
]);