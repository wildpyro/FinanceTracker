(function() {
    'use strict';

    angular.module('stockpositions').factory('TxnsForm', factory);

    function factory() {

      var getFormFields = function(disabled, isAdd) {
        
        var fields = [
          { 
            key: 'date',
            type: 'input',
            templateOptions: {
              label: 'Date:'
            }
          },          
          { 
  					key: 'symbol',
  					type: 'input',
  					templateOptions: {
  			      label: 'Symbol:'
  			    }
          },
          {
            key: 'type',
            type: 'input',
            templateOptions: {
              label: 'Txn Type:'
            }
          },
          {  
            key: 'price',
            type: 'input',
            templateOptions: {
              label: 'Price:'
            }  
          },
          {
            key: 'shares',
            type: 'input',
            templateOptions: {
              label: 'Shares:'
            }  
          },
          {
            key: 'commission',
            type: 'input',
            templateOptions: {
              label: 'Commission:'
            }  
          }            
  			];

        return fields;

      };

      var service = {
        getFormFields: getFormFields
      };

      return service;
  }
})();
