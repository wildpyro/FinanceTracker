'use strict';

angular.module('stockpositions').factory('TxnsForm', ['TxnTypesService', 'AccountTypeService', function(txnTypes, accountTypes) {

  var getFormFields = function() {
    
    var fields = [
      {
        className: 'row',
        fieldGroup: [
          {
            className: 'col-xs-6',
            key: 'date',
            type: 'datepicker',
            templateOptions: {
              label: 'Date',
              type: 'text',
              datepickerPopup: 'dd-MMMM-yyyy'
            }
          },
          {
            className: 'col-xs-6',
            key: 'price',
            type: 'input',
            templateOptions: {
              label: 'Price:'
            }  
          }
        ]
      },
      {
        className: 'row',
        fieldGroup: [
          {
            className: 'col-xs-6',
            key: 'accountType',
            type: 'select',
            templateOptions: {
              label: 'Account:',
              options: accountTypes.getEnums()
            }
          },
          {
            className: 'col-xs-6',
            key: 'shares',
            type: 'input',
            templateOptions: {
              label: 'Shares:'
            }  
          }
        ]
      },
      {
        className: 'row',
        fieldGroup: [
          {
            className: 'col-xs-6',
            key: 'symbol',
            type: 'input',
            templateOptions: {
              label: 'Symbol:'
            }
          },
          {
            className: 'col-xs-6',
            key: 'commission',
            type: 'input',
            templateOptions: {
              label: 'Commission:'
            }  
          }
        ]
      },              
      {
        className: 'row',
        fieldGroup: [
          {
            className: 'col-xs-6',
            key: 'type',
            type: 'select',
            templateOptions: {
              label: 'Txn Type:',
               options: txnTypes.getEnums()
            }
          }
        ]
      }      
		];

    return fields;
  };

  var service = {
    getFormFields1: getFormFields
  };

    return service;
}]);