'use strict';

angular.module('stockpositions').factory('MonthlyArchiveForm', [function() {

    var defaultDate = new Date();

    var getFormFields = function() {

        var fields = [
          {
            key: 'month',
            type: 'input',
            templateOptions: {
              label: 'Month:'
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
