'use strict';
angular.module('stockpositions').factory('ImportDataForm', ['StockPositionsLayoutService', 'ImportTypesService', function(StockPositionsLayoutService, ImportTypesService) {

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
        key: 'fileToImport',
        type: 'input',
        id: 'fileToUpload',
        templateOptions: {
          label: 'File to import:',
          type: 'file',
          addonRight: {
            class: 'glyphicon glyphicon-save'
          }
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
