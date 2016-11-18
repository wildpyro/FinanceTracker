'use strict';

angular.module('accounts').factory('AccountsForm', ['AccountTypeService', function (AccountTypeService) {

    var getFormFields = function (disabled) {
        var fields = [
        {
          className: 'form-group',
          fieldGroup: [
            {
              key: 'description',
              type: 'input',
              templateOptions: {
                label: 'Description:',
                disabled: disabled,
                required: true
              }
            },
            {
              key: 'accountNo',
              type: 'input',
              templateOptions: {
                label: 'Account No:',
                disabled: disabled,
                required: true
              }
            },
            {
              key: 'accountType',
              type: 'select',
              templateOptions: {
                label: 'Account Type:',
                options: AccountTypeService.getEnums(),
                disabled: disabled,
                required: true
              }
            }
          ]
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
