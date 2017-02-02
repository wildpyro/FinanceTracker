'use strict';

angular.module('accounts').factory('AccountsService', '$http', function ($http) {

    var enums = [];

    function init() {
        console.log('sent response');
        $http.post('/accounts/fetchAccountNo')
            .success(function (response) {
                enums = response.result;
                console.log(response);
            })
            .error(function (response) {
                console.log(response.message);
            });
    }

    init();

    function getEnums() {
        return enums;
    }

    function getText(enumValue) {

        var test = enums.filter(function (enumToEval) {
            return enumToEval.value === enumValue;
        })[0];

        if (angular.isDefined(test)) {
            return test.name;
        } else {
            return null;
        }
    }

    function getValue(enumName) {
        var test = enums.filter(function (enumToEval) {
            return enumToEval.name === enumName;
        })[0];

        if (angular.isDefined(test)) {
            return test.value;
        } else {
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