(function() {
    'use strict';

    angular.module('core').factory('TableSettings', factory);

    factory.$inject = ['ngTableParams'];

    function factory(ngTableParams) {

      var getData = function(Entity) {
        return function($defer, params) {
  				Entity.get(params.url(), function(response) {
  					params.total(response.total);
  					$defer.resolve(response.results);
  				});
  			};

      };

      var params = {
        page: 1,
        count: 5
      };

      var settings = {
        total: 0,
        counts: [5, 10, 15],
        filterDelay: 0,
      };

      /* jshint ignore:start */
      var tableParams = new ngTableParams(params, settings);

      var getParams = function(Entity) {
        tableParams.settings({getData: getData(Entity)});
        //console.log(tableParams.getData);
        return tableParams;
      };

      var getInstance = function() {
        return tableParams;
      };

      var setData = function(dataToSet) {
        //console.log(dataToSet);
        //tableParams.settings({getData: dataToSet});
        return tableParams;
      };

      var service = {
        getParams: getParams,
        getInstance: getInstance,
        setData: setData
      };


      return service;
      /* jshint ignore:end */

  }

})();
