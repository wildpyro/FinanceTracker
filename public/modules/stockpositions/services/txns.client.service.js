'use strict';

//Txns service used to communicate Txns REST endpoints
angular.module('stockpositions').factory('Txns', ['$resource',
	function($resource) {
		return $resource('Txns/:TxnId', { TxnId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);