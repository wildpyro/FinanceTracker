(function() {
    'use strict';

    angular
        .module('accounts')
        .factory('AccountsForm', factory);

    function factory() {

      var accountTypesEnum = [{name: 'RESP', value: 0},
                              {name: 'Open', value: 1},
                              {name: 'RSP', value: 2},
                              {name: 'TFSA', value: 3}];

      var getFormFields = function(disabled) {

        var fields = [
  				{
  					key: 'name',
  					type: 'input',
  					templateOptions: {
  			      label: 'Name:',
  						disabled: disabled
  			    }
  				},
          {
            key: 'accountNo',
            type: 'input',
            templateOptions: {
              label: 'Account No:',
              disabled: disabled
            }
          },
          {
            key: 'accountType',
            type: 'select',
            templateOptions: {
              label: 'Account Type:',
              options: accountTypesEnum,
              disabled: disabled
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

})();