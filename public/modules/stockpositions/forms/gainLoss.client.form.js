'use strict';

angular.module('stockpositions').factory('GainLossesForm', ['CurrenciesEnum', 'AccountTypeService', function(currenciesEnum, accountTypes) {
  var getFormFields = function() {
    
    var fields = [
      {
        className: 'gainlossRow',
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
            key: 'settlementDate',
            type: 'datepicker',
            templateOptions: {
              label: 'Settlement Date',
              type: 'text'
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
            key: 'description',
            type: 'input',
            templateOptions: {
              label: 'Description:'
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
            key: 'shares',
            type: 'input',
            templateOptions: {
              label: 'Shares:'
            }  
          },
          {
            className: 'col-xs-3',
            key: 'tradeCurrency',
            type: 'select',
            templateOptions: {
              label: 'Trade Currency:',
              options: currenciesEnum.getEnums()
            }
          },          
          {
            className: 'col-xs-3',
            key: 'exchangeRate',
            type: 'input',
            templateOptions: {
              label: 'Exchange Rate:'
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
            key: 'book',
            type: 'input',
            templateOptions: {
              label: 'Book Value:'
            }
          },
          {
            className: 'col-xs-3',
            key: 'gainLoss',
            type: 'input',
            templateOptions: {
              label: 'Gain Loss:'
            }  
          },
          {
            className: 'col-xs-3',
            key: 'gainLossPct',
            type: 'input',
            templateOptions: {
              label: 'Gain Loss Pct:'
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
