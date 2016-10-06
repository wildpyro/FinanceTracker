'use strict';

//networth service used to communicate networth REST endpoints
angular.module('networth').factory('Networth', ['$resource',
	function($resource) {
		return $resource('networth/:networthId', { networthId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);