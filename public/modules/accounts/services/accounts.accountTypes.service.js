(function() {
    'use strict';

    angular
        .module('accounts')
        .factory('AccountTypeService', accountTypes);

    function accountTypes() {
    	function getAccountTypes(){
    		return [
				{
					'name': 'Open',
					'value': 0
	    		},
	    		{
					'name': 'RSP',
					'value': 1
	    		},
	    		{
					'name': 'RESP',
					'value': 2
	    		},
	    		{
					'name': 'TFSA',
					'value': 3
	    		},
	    		{
					'name': 'Joint',
					'value': 4
	    		}
    		];
    	}
      }

      var service = {
        getAccountTypes: accountTypes.getAccountTypes
      };

      return service;
})();