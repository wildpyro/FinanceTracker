'use strict';

angular.module('accounts').factory('AccountTypeService', function() { 

    var enums = [
            {
                'name': 'Open',
                'value': 'open'
            },
            {
                'name': 'RSP',
                'value': 'rsp'
            },
            {
                'name': 'RESP',
                'value': 'resp'
            },
            {
                'name': 'TFSA',
                'value': 'tfsa'
            },
            {
                'name': 'Joint',
                'value': 'joint'
            }
        ];

    function getEnums(){
        return enums;
    }

    function getText(enumValue){

        var test = enums.filter(function(enumToEval) { 
            return enumToEval.value === enumValue;
        })[0];

        if (angular.isDefined(test)) {
            return test.name; 
        }
        else {
            return null;
        }
     
    }

    function getValue(enumName){
        var test = enums.filter(function(enumToEval) { 
            return enumToEval.name === enumName;
        })[0];

        if (angular.isDefined(test)) {
            return test.value; 
        }
        else {
            return null;
        }
    }

  var service = {
    getEnums: getEnums,
    getText: getText,
    getValue: getValue
  };

  return service;
});