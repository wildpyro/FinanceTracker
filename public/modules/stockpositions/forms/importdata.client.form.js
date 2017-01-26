'use strict';
angular.module('stockpositions').factory('ImportDataForm', ['StockPositionsLayoutService', 'ImportTypesService', 'AccountsService',
  function(StockPositionsLayoutService, ImportTypesService, AccountsService) {

  var getFormFields = function () {
    var fields = [
      {
        key: 'layout',
        type: 'select',
        templateOptions: {
          options: StockPositionsLayoutService.getEnums(),
          label: 'Layout type:'
        }        
      },
      {
        key: 'type',
        type: 'select',
        templateOptions: {
          options: ImportTypesService.getEnums(),
          label: 'File type:',
          disabled: true
        },
        expressionProperties: {
          'templateOptions.disabled': 'model.layout !== "bns"'
        }
      },
      {
        //Only needed for stock 
        key: 'accounttype',
        type: 'select',
        templateOptions: {
          options: AccountsService.getEnums(),
          label: 'Account number:',
          disabled: true
        },
        expressionProperties: {
          'templateOptions.disabled': 'model.type !== "stocks"'
        }
      },      
      {
        key: 'fileToImport',
        type: 'input',
        id: 'fileToUpload',
        templateOptions: {
          label: '',
          type: 'file'
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
