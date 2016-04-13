'use strict';
angular.module('core').factory('SmartTableFactory', ['$http', '$q', '$filter', '$timeout', function ($http, $q, $filter, $timeout) {

    function getPage(start, number, params, Entity) {

        var deferred = $q.defer();

        Entity.get(params.pagination, function(response) {
            deferred.resolve({
                data: response.results,
                numberOfPages: Math.ceil(response.results.length / number)
            });
        });

        //console.log(params);        


        return deferred.promise;
    }

    return {
        getPage: getPage
    };

}]);
