'use strict';

//Gain Losses service used to communicate to the Gain Losses REST endpoints
angular.module('stockpositions').factory('GainLosses', ['$resource',
	function($resource) {
		return $resource('gainlosses/:gainlossesId', { TxnId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
