'use strict';

//Stockpositiondetails service used to communicate Stockpositiondetails REST endpoints
angular.module('stockpositiondetails').factory('Stockpositiondetails', ['$resource',
	function($resource) {
		return $resource('stockpositiondetails/:stockpositiondetailId', { stockpositiondetailId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);