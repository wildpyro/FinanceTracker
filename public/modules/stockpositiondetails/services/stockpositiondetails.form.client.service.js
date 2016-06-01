(function() {
    'use strict';

    angular.module('stockpositiondetails').factory('StockpositiondetailsForm', factory);

    function factory() {

      var getFormFieldsQuote1 = function(disabled) {

        var fields = [
          {
            key: 'Name',
            type: 'input',
            templateOptions: {
              label: 'Name:',
              disabled: disabled
            }
          },
          {
            key: 'StockExchange',
            type: 'input',
            templateOptions: {
              label: 'Exchange:',
              disabled: disabled
            }
          },
          {
            key: 'Symbol',
            type: 'input',
            templateOptions: {
              label: 'Symbol:',
              disabled: disabled
            }
          },        
          {
            key: 'lastUpdated',
            type: 'input',
            templateOptions: {
              label: 'Last Updated:',
              disabled: disabled
            }
          },
          {
            key: 'MarketCapitalization',
            type: 'input',
            templateOptions: {
              label: 'Market Capitalization:',
              disabled: disabled
            }
          }
        ];
        
        return fields;
      };

      var getFormFieldsQuote2 = function(disabled) {

        var fields = [      
          {
            key: 'DaysLow',
            type: 'input',
            templateOptions: {
              label: 'Intra Day Low:',
              disabled: disabled
            }
          },                    
          {
            key: 'DaysHigh',
            type: 'input',
            templateOptions: {
              label: 'Intra Day High:',
              disabled: disabled
            }
          },
          {
            key: 'YearLow',
            type: 'input',
            templateOptions: {
              label: '52 Week Low:',
              disabled: disabled
            }
          },
          {
            key: 'YearHigh',
            type: 'input',
            templateOptions: {
              label: '52 Week High:',
              disabled: disabled
            }
          },
          {
            key: 'Volume',
            type: 'input',
            templateOptions: {
              label: 'Shares Traded:',
              disabled: disabled
            }
          }
        ];
        
        return fields;
      };

      var getFormFieldsPerf1 = function(disabled) {

        var fields = [
          {
            key: 'FiftydayMovingAverage',
            type: 'input',
            templateOptions: {
              label: '50 Day Moving Average:',
              disabled: disabled
            }
          },
          {
            key: 'TwoHundreddayMovingAverage',
            type: 'input',
            templateOptions: {
              label: '200 Day Moving Average:',
              disabled: disabled
            }
          },
          {
            key: 'PercentChangeFromFiftydayMovingAverage',
            type: 'input',
            templateOptions: {
              label: 'Pct Change 50 Day MVA:',
              disabled: disabled
            }
          },        
          {
            key: 'PercentChangeFromTwoHundreddayMovingAverage',
            type: 'input',
            templateOptions: {
              label: 'Pct Change 200 Day MVA:',
              disabled: disabled
            }
          }
        ];
        
        return fields;
      };

      var getFormFieldsFund1 = function(disabled) {

        var fields = [
          {
            key: 'PERatio',
            type: 'input',
            templateOptions: {
              label: 'P/E Ratio:',
              disabled: disabled
            }
          },        
          {
            key: 'ExDividendDate',
            type: 'input',
            templateOptions: {
              label: 'Ex Dividend Date:',
              disabled: disabled
            }
          },
          {
            key: 'DividendPayDate',
            type: 'input',
            templateOptions: {
              label: 'Dividend Date:',
              disabled: disabled
            }
          },          
          {
            key: 'PriceSales',
            type: 'input',
            templateOptions: {
              label: 'Pirce to Sales:',
              disabled: disabled
            }
          },
          {
            key: 'PriceBook',
            type: 'input',
            templateOptions: {
              label: 'Price to Book:',
              disabled: disabled
            }
          }
        ];
        
        return fields;
      };

      var getFormFieldsFund2 = function(disabled) {

        var fields = [
          {
            key: 'EarningsShare',
            type: 'input',
            templateOptions: {
              label: 'Earnings per Share:',
              disabled: disabled
            }
          },
          {
            key: 'EPSEstimateNextQuarter',
            type: 'input',
            templateOptions: {
              label: 'EPS E Next Quarter:',
              disabled: disabled
            }
          },          
          {
            key: 'EPSEstimateCurrentYear',
            type: 'input',
            templateOptions: {
              label: 'EPS E Current Year:',
              disabled: disabled
            }
          },
          {
            key: 'EPSEstimateNextYear',
            type: 'input',
            templateOptions: {
              label: 'EPS E Next Year:',
              disabled: disabled
            }
          }
        ];
        
        return fields;
      };            

      var service = {
        getFormFieldsQuote1: getFormFieldsQuote1,
        getFormFieldsQuote2: getFormFieldsQuote2,
        
        getFormFieldsPerf1: getFormFieldsPerf1,
        
        getFormFieldsFund1: getFormFieldsFund1,
        getFormFieldsFund2: getFormFieldsFund2
      };

      return service;
  }
})();
