'use strict';

angular.module('stockpositions').factory('StockpositionsForm', ['AccountTypeService', function(AccountTypeService) {

      var getFormFields = function(disabled) {

        var fields = [
          {
            key: 'accountType',
            type: 'select',
            templateOptions: {
              label: 'Account Type:',
              options: AccountTypeService.getEnums(),
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
