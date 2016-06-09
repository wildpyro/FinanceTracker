'use strict';

//Txns service used to communicate Txns REST endpoints
angular.module('stockpositions').factory('Txns', ['$resource',
	function($resource) {
		return $resource('txns/:txnId', { TxnId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);