'use strict';

angular.module('stockpositions').factory('PositionsTypesService', function() { 

    var enums = [
            {
                'name': 'Cash',
                'value': 'cash'
            },
            {
                'name': 'Equity',
                'value': 'equity'
            },
            {
                'name': 'Fixed Income',
                'value': 'fixed'
            }
        ];

    function getEnums() {
        return enums;
    }

    function getEnum(enumValue) {

        return enums[enumValue];
    }

    function getText(enumValue) {
        return enums[enumValue].name;
    }

    function getValue(enumValue) {
        return enums[enumValue].value;
    }


  var service = {
    getEnums: getEnums,
    getEnum: getEnum,
    getText: getText,
    getValue: getValue
  };

  return service;
});