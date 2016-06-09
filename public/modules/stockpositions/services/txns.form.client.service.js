'use strict';

angular.module('stockpositions').factory('TxnsForm', ['TxnTypesService', function(txnTypes) {

  var getFormFields = function() {
    
    var fields = [
      { 
        key: 'date',
        type: 'datepicker',
        templateOptions: {
          label: 'Date',
          type: 'text',
          datepickerPopup: 'dd-MMMM-yyyy'
        }
      },          
      { 
				key: 'symbol',
				type: 'input',
				templateOptions: {
		      label: 'Symbol:'
		    }
      },
      {
        key: 'type',
        type: 'select',
        templateOptions: {
          label: 'Txn Type:',
           options: txnTypes.getEnums()
        }
      },
      {  
        key: 'price',
        type: 'input',
        templateOptions: {
          label: 'Price:'
        }  
      },
      {
        key: 'shares',
        type: 'input',
        templateOptions: {
          label: 'Shares:'
        }  
      },
      {
        key: 'commission',
        type: 'input',
        templateOptions: {
          label: 'Commission:'
        }  
      }            
		];

    return fields;

  };

  var service = {
    getFormFields: getFormFields
  };

    return service;
}]);