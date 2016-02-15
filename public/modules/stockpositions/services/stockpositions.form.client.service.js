'use strict';

angular.module('stockpositions').factory('StockpositionsForm', ['ACCOUNT_TYPES_1', function(ACCOUNT_TYPES_1) {

      var accountTypesEnum = [{name: 'RESP', value: 0},
                              {name: 'Open', value: 1},
                              {name: 'RSP', value: 2},
                              {name: 'TFSA', value: 3}];


      var getFormFields = function(disabled) {

        var fields = [
          {
            key: 'accountType',
            type: 'select',
            templateOptions: {
              label: 'Account Type:',
              options: [ACCOUNT_TYPES_1],
              disabled: disabled
            }
          },
          { 
  					key: 'symbol',
  					type: 'input',
  					templateOptions: {
  			      label: 'Symbol:',
  						disabled: disabled
  			    }
          },
          {
            key: 'description',
            type: 'input',
            templateOptions: {
              label: 'Description:',
              disabled: disabled
            }
          },
          {  
            key: 'price',
            type: 'input',
            templateOptions: {
              label: 'Price:',
              disabled: disabled
            }  
          },
          {
            key: 'shares',
            type: 'input',
            templateOptions: {
              label: 'Share:',
              disabled: disabled
            }  
          },
          {
            key: 'market',
            type: 'input',
            templateOptions: {
              label: 'Market Value:',
              disabled: true
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
]);
