'use strict';

//Gain Losses service used to communicate to the Gain Losses REST endpoints
angular.module('stockpositions').factory('Income', ['$resource',
	function($resource) {
		return $resource('income/:incomeId', { TxnId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
