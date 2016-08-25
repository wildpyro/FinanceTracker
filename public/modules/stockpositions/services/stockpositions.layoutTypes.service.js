'use strict';

angular.module('stockpositions').factory('StockPositionsLayoutService', function() { 

    var enums = [
            {
                'name': 'BNS - ITrade',
                'value': 'bns'
            },
            {
                'name': 'Tangerine',
                'value': 'tang'
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