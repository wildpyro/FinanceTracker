'use strict';

angular.module('stockpositions').factory('TxnsForm', ['TxnTypesService', 'AccountTypeService', function(txnTypes, accountTypes) {

  function createTradeInfo(field, newValue, scope) {
    if (newValue) {
      var book = field === 'book' ? Number(newValue) : Number(scope.model.book),
          settle = field === 'book' ? Number(scope.model.settle) : Number(newValue),
          diff = Number(settle - book).toFixed(2),
          pctDiff = Number(Math.abs(diff)/book) * 100;

      if (scope.model.type === 'Sell') {
        if (book > settle) {
          scope.model.tradeinfo = 'Loss of: $'.concat(diff).concat(' Pct: -').concat(pctDiff.toFixed(2)).concat('%');
        }
        else {
          scope.model.tradeinfo = 'Gain of: $'.concat(diff).concat(' Pct: ').concat(pctDiff.toFixed(2)).concat('%');
        }
      }
      else if (scope.model.type === 'Buy') {
          scope.model.tradeinfo = 'Buy';        
      }
      else if (scope.model.type === 'Drip') {
          scope.model.tradeinfo = 'Drip';        
      }
      else if (scope.model.type === 'Dividend') {
          scope.model.tradeinfo = 'Dividend';
      }      
    }
  }

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
            key: 'date',
            type: 'datepicker',
            templateOptions: {
              label: 'Date',
              type: 'text',
              datepickerPopup: 'dd-MMMM-yyyy'
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
            },
            watcher: {
              listener: function(field, newValue, oldValue, scope, stopWatching) {
                createTradeInfo('book', newValue, scope);
              }
            }
          },
          {
            className: 'col-xs-3',
            key: 'settle',
            type: 'input',
            templateOptions: {
              label: 'Settlement Amount:'
            },
            watcher: {
              listener: function(field, newValue, oldValue, scope, stopWatching) {
                createTradeInfo('settle', newValue, scope);
              }
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
              disabled: 'true'
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