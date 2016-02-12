(function() {
    'use strict';

    angular
        .module('stockpositions')
        .factory('StockpositionsForm', factory);

      //todo - maybe try and pass the account type in to the factory? Figure out where that comes from 
    function factory() {

      var accountTypesEnum = [{name: 'RESP', value: 0},
                              {name: 'Open', value: 1},
                              {name: 'RSP', value: 2},
                              {name: 'TFSA', value: 3}];


      var getFormFields = function(disabled) {

        var fields = [
          {
            key: 'accountType',
            type: 'select',
            templateOptions: {
              label: 'Account Type:',
              options: accountTypesEnum,
              disabled: true
            }
          },
          { 
  					key: 'symbol',
  					type: 'input',
  					templateOptions: {
  			      label: 'Symbol:',
  						disabled: disabled
  			    }
          },
          {
            key: 'description',
            type: 'input',
            templateOptions: {
              label: 'Description:',
              disabled: disabled
            }
          },
          {  
            key: 'price',
            type: 'input',
            templateOptions: {
              label: 'Price:',
              disabled: disabled
            }  
          },
          {
            key: 'shares',
            type: 'input',
            templateOptions: {
              label: 'Share:',
              disabled: disabled
            }  
          },
          {
            key: 'market',
            type: 'input',
            templateOptions: {
              label: 'Market Value:',
              disabled: true
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
