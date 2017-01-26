'use strict';

angular.module('users').factory('User', ['$resource', function($resource) {
	var User = $resource(
        'users', 
		{},
		{
			update: {
				method: 'PUT'
			}
		}
	);

	User.prototype.signin = function(credentials) {
		$resource.post('/auth/signin', credentials)
		.then(function(response) {
				return response;
		});
	};		

	return User;	
}]);