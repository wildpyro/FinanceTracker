'use strict';

angular.module('stockpositions').factory('ExportDataForm', [function() {

    var defaultDate = new Date(),
        defaultDirectory = '/';

    var getFormFields = function() {

        var fields = [
          {
            key: 'directory',
            type: 'input',
            templateOptions: {
              label: 'Directory for output:',
              addonRight: {
                class: 'glyphicon glyphicon-floppy-open'
              }
            }
          },
          { 
            key: 'year',
            type: 'input',
            templateOptions: {
              label: 'Year:',
              default: 'defaultDate.getFullYear'
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
