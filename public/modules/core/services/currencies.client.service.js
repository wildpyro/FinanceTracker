'use strict';

angular.module('core').factory('CurrenciesEnum', function() { 

    var enums = [
            {
                'name': 'Canadian',
                'value': 'CAD'
            },
            {
                'name': 'US Dollar',
                'value': 'USD'
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
