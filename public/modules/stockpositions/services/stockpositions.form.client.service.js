'use strict';

angular.module('stockpositions').factory('StockpositionsForm', ['AccountTypeService', 'PositionsTypesService', function(accountTypes, positionsTypes) {

  var getFormFields = function(disabled) {
      var fields = [
      {
        className: 'form-group',
          fieldGroup: [          
            {
              key: 'accountType',
              type: 'select',
              templateOptions: {
                label: 'Account Type:',
                options: accountTypes.getEnums(),
                disabled: disabled,
                required: true
              }
            },
            {
              key: 'type',
              type: 'select',
              templateOptions: {
                label: 'Postion Type',
                options: positionsTypes.getEnums(),
                disabled: disabled,
                required: true
              }
            },            
            { 
              key: 'symbol',
              type: 'input',
              templateOptions: {
                label: 'Symbol:',
                disabled: disabled,
                required: true
              }
            },
            {
              key: 'description',
              type: 'input',
              templateOptions: {
                label: 'Description:',
                disabled: disabled,
                required: true
              }
            },
            {  
              key: 'price',
              type: 'input',
              templateOptions: {
                label: 'Price:',
                disabled: disabled,
                required: true
              }  
            },
            {
              key: 'shares',
              type: 'input',
              templateOptions: {
                label: 'Share:',
                disabled: disabled,
                required: true
              }  
            },
            {
              key: 'book',
              type: 'input',
              templateOptions: {
                label: 'Book Cost:',
                disabled: disabled,
                required: true
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
          ]
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
