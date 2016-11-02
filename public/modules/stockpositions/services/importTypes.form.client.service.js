'use strict';

angular.module('stockpositions').factory('ImportTypesService', function() { 

    var enums = [
            {
                'name': 'Transaction History',
                'value': 'txnhist'
            },
            {
                'name': 'Income and Dividends',
                'value': 'incdiv'
            },
            {
                'name': 'Tax Liability',
                'value': 'tax'
            },
            {
                'name': 'Stock Positions',
                'value': 'stocks'
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