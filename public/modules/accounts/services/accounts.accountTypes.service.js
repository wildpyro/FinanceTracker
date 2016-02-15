'use strict';

angular.module('accounts').factory('AccountTypeService', function() { 

    var enums = [
            {
                'name': 'Open',
                'value': 0
            },
            {
                'name': 'RSP',
                'value': 1
            },
            {
                'name': 'RESP',
                'value': 2
            },
            {
                'name': 'TFSA',
                'value': 3
            },
            {
                'name': 'Joint',
                'value': 4
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