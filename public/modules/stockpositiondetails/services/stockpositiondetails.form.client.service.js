(function() {
    'use strict';

    angular.module('stockpositiondetails').factory('StockpositiondetailsForm', factory);

    function factory() {

      var getFormFieldsQuote1 = function(disabled) {

        var fields = [
          {
            className: 'info',
            key: 'Name',
            type: 'input',
            templateOptions: {
              label: 'Name:',
              readOnly: true
            }
          },
          {
            key: 'StockExchange',
            type: 'input',
            templateOptions: {
              label: 'Exchange:',
              readOnly: true
            }
          },
          {
            key: 'MarketCapitalization',
            type: 'input',
            templateOptions: {
              label: 'Market Capitalization:',
              readOnly: true
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
              readOnly: true
            }
          },                    
          {
            key: 'DaysHigh',
            type: 'input',
            templateOptions: {
              label: 'Intra Day High:',
              readOnly: true
            }
          },
          {
            key: 'Volume',
            type: 'input',
            templateOptions: {
              label: 'Shares Traded:',
              readOnly: true
            }
          }
        ];
        
        return fields;
      };

      var getFormFieldsQuote3 = function(disabled) {

        var fields = [      
          {
            key: 'YearLow',
            type: 'input',
            templateOptions: {
              label: '52 Week Low:',
              readOnly: true
            }
          },
          {
            key: 'YearHigh',
            type: 'input',
            templateOptions: {
              label: '52 Week High:',
              readOnly: true
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
              readOnly: true
            }
          },
          {
            key: 'TwoHundreddayMovingAverage',
            type: 'input',
            templateOptions: {
              label: '200 Day Moving Average:',
              readOnly: true
            }
          },
          {
            key: 'PercentChangeFromFiftydayMovingAverage',
            type: 'input',
            templateOptions: {
              label: 'Pct Change 50 Day MVA:',
              readOnly: true
            }
          },        
          {
            key: 'PercentChangeFromTwoHundreddayMovingAverage',
            type: 'input',
            templateOptions: {
              label: 'Pct Change 200 Day MVA:',
              readOnly: true
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
              readOnly: true
            }
          },          
          {
            key: 'PriceSales',
            type: 'input',
            templateOptions: {
              label: 'Pirce to Sales:',
              readOnly: true
            }
          },
          {
            key: 'PriceBook',
            type: 'input',
            templateOptions: {
              label: 'Price to Book:',
              readOnly: true
            }
          }
        ];
        
        return fields;
      };

      var getFormFieldsFund2 = function(disabled) {

        var fields = [
          {
            key: 'ExDividendDate',
            type: 'input',
            templateOptions: {
              label: 'Ex Dividend Date:',
              readOnly: true
            }
          },
          {
            key: 'DividendPayDate',
            type: 'input',
            templateOptions: {
              label: 'Dividend Date:',
              readOnly: true
            }
          }
        ];

        return fields;
      };      

      var getFormFieldsFund3 = function(disabled) {

        var fields = [
          {
            key: 'EarningsShare',
            type: 'input',
            templateOptions: {
              label: 'Earnings per Share:',
              readOnly: true
            }
          },
          {
            key: 'EPSEstimateNextQuarter',
            type: 'input',
            templateOptions: {
              label: 'EPS E Next Quarter:',
              readOnly: true
            }
          },          
          {
            key: 'EPSEstimateCurrentYear',
            type: 'input',
            templateOptions: {
              label: 'EPS E Current Year:',
              readOnly: true
            }
          },
          {
            key: 'EPSEstimateNextYear',
            type: 'input',
            templateOptions: {
              label: 'EPS E Next Year:',
              readOnly: true
            }
          }
        ];
        
        return fields;
      };            

      var service = {
        getFormFieldsQuote1: getFormFieldsQuote1,
        getFormFieldsQuote2: getFormFieldsQuote2,
        getFormFieldsQuote3: getFormFieldsQuote3,
        
        getFormFieldsPerf1: getFormFieldsPerf1,
        
        getFormFieldsFund1: getFormFieldsFund1,
        getFormFieldsFund2: getFormFieldsFund2,
        getFormFieldsFund3: getFormFieldsFund3
      };

      return service;
  }
})();
