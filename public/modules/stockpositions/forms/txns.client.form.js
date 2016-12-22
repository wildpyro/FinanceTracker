'use strict';

angular.module('stockpositions').factory('TxnsForm', ['TxnTypesService', 'AccountTypeService', function(txnTypes, accountTypes) {
  var getFormFields = function() {
    
    var fields = [
      {
        className: 'txnRow',
        fieldGroup: [
          {
            className: 'col-xs-3',
            key: 'accountType',
            type: 'select',
            templateOptions: {
              label: 'Account:',
              options: accountTypes.getEnums()
            }
          },
          {
            className: 'col-xs-3',
            key: 'symbol',
            type: 'input',
            templateOptions: {
              label: 'Symbol:'
            }
          },
          {
            className: 'col-xs-3',
            key: 'type',
            type: 'select',
            templateOptions: {
              label: 'Txn Type:',
               options: txnTypes.getEnums()
            }
          },          
          {
            className: 'col-xs-3',
            key: 'shares',
            type: 'input',
            templateOptions: {
              label: 'Shares:'
            }  
          },                              
          {
            className: 'col-xs-3',
            key: 'settlementDate',
            type: 'datepicker',
            templateOptions: {
              label: 'Settlement Date',
              type: 'text'
            }
          },
          {
            className: 'col-xs-3',
            key: 'price',
            type: 'input',
            templateOptions: {
              label: 'Price:'
            }  
          },
          {
            className: 'col-xs-3',
            key: 'book',
            type: 'input',
            templateOptions: {
              label: 'Book Value:'
            }
          },
          {
            className: 'col-xs-3',
            key: 'settle',
            type: 'input',
            templateOptions: {
              label: 'Settlement Amount:'
            }
          },
          {
            className: 'col-xs-3',
            key: 'commission',
            type: 'input',
            templateOptions: {
              label: 'Commission:'
            }  
          },          
          {
            className: 'col-xs-9',
            key: 'tradeinfo',
            type: 'input',
            templateOptions: {
              label: 'Trade Info:',
              disabled: true
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
