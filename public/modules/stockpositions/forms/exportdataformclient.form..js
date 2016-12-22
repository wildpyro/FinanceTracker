'use strict';

angular.module('stockpositions').factory('ExportDataForm', [function() {

    var defaultDate = new Date(),
        defaultDirectory = '/';

    var getFormFields = function() {

        var fields = [
          { 
            key: 'year',
            type: 'input',
            templateOptions: {
              label: 'Year:',
              default: 'defaultDate.getFullYear'
            }
          },          
          {
            key: 'directory',
            type: 'input',
            templateOptions: {
              label: 'Directory for output:',
              default: defaultDirectory,
              addonRight: {
                class: 'glyphicon glyphicon-hdd'
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
