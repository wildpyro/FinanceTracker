'use strict';

angular.module('stockpositions').factory('ExchangesService', function() { 

    var enums = [
            {
                'name': 'TSX',
                'value': 'TSX',
                'yahoo': 'TO'
            },
            {
                'name': 'NYSE',
                'value': 'NYSE',
                'yahoo': ''
            },
            {
                'name': 'TSX Venture',
                'value': 'V',
                'yahoo': 'V'
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
