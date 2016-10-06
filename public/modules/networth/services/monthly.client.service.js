'use strict';

//monthly service used to communicate monthly REST endpoints
angular.module('networth').factory('MonthlyStats', ['$resource', function($resource) {
		return $resource('monthlyListing', {}, { 
			query: {method: 'GET', params: {}, isArray: true }, 
			update: {method: 'PUT'}
		});
	}
]);

/*
service.factory('ProductsRest', ['$resource', function ($resource) {
    return $resource('service/products/', {}, {
        query: {method: 'GET', params: {}, isArray: true },
        save: {method: 'POST', url: 'service/products/modifyProduct'},
        update: { method: 'PUT', url: 'service/products/modifyProduct'}
    });
}]);
*/