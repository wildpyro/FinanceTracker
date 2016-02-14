'use strict';

//Networths service used to communicate Networths REST endpoints
angular.module('networths').factory('Networths', ['$resource',
	function($resource) {
		return $resource('networths/:networthId', { networthId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);