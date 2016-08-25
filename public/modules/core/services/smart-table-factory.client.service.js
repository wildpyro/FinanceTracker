'use strict';
angular.module('core').factory('SmartTableFactory', ['$http', '$q', '$filter', '$timeout', function ($http, $q, $filter, $timeout) {

    function getPage(start, number, params, Entity) {

        var deferred = $q.defer();

        console.log(params.search.predicateObject);

        Entity.get({pagination: params.pagination, filter: params.search.predicateObject}, function(response) {
            deferred.resolve({
                data: response.results,
                resultsPages: Math.ceil(response.results.length / number)
            });
        });

        return deferred.promise;
    }

    return {
        getPage: getPage
    };

}]);
