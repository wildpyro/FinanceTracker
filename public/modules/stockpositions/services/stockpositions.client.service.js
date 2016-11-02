'use strict';

//Stockpositions service used to communicate Stockpositions REST endpoints
angular.module('stockpositions').factory('Stockpositions', ['$resource',
	function($resource) {
		return $resource('stockpositions/:stockpositionId', { stockpositionId: '@_id'}, 
		{
			update: {
				method: 'PUT'
			}
		});
	}
]);