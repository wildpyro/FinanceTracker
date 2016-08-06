'use strict';

angular.module('stockpositions').factory('StockpositionsForm', ['AccountTypeService', 'PositionsTypesService', function(accountTypes, positionsTypes) {

      var getFormFields = function(disabled, isAdd) {

        var fields = [
          {
            key: 'accountType',
            type: 'select',
            templateOptions: {
              label: 'Account Type:',
              options: accountTypes.getEnums(),
              disabled: isAdd
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
            key: 'book',
            type: 'input',
            templateOptions: {
              label: 'Book Cost:',
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
          },
          {
            key: 'isCash',
            type: 'checkbox',
            templateOptions: {
              label: 'Is cash?:',
              disabled: disabled
            }
          },
          {
            key: 'type',
            type: 'select',
            templateOptions: {
              label: 'Postion Type',
              options: positionsTypes.getEnums(),
              disabled: disabled
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
