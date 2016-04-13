'use strict';

angular.module('accounts').factory('AccountsForm', ['AccountTypeService', function(AccountTypeService) {

      var getFormFields = function(disabled) {

        var fields = [
        	{
            key: 'description',
            type: 'input',
            templateOptions: {
              label: 'Description:',
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
              options: AccountTypeService.getEnums(),
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
]);
