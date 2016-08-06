'use strict';

angular.module('stockpositions').factory('TxnTypesService', function() { 

    var enums = [
            {
                'name': 'Buy',
                'value': 'Buy'
            },
            {
                'name': 'Sell',
                'value': 'Sell'
            },
            {
                'name': 'Cash Dividend',
                'value': 'Dividend'
            },
            {
                'name': 'Drip Purchase',
                'value': 'Drip'
            }
        ];

    function getEnums(){
        return enums;
    }

    function getText(enumValue){
        return enums[enumValue].name;
    }

    function getValue(enumValue){
        return enums[enumValue].value;
    }

  var service = {
    getEnums: getEnums,
    getText: getText,
    getValue: getValue
  };

  return service;
});