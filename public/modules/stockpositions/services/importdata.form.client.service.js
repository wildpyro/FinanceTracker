'use strict';

angular.module('stockpositions').factory('ImportDataForm', ['StockPositionsLayoutService', function(StockPositionsLayoutService) {

    var getFormFields = function() {

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
