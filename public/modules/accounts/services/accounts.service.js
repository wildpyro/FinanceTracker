'use strict';

angular.module('accounts').service('AccountsService', ['$http', function($http) {
    this.saveAccount = function(account) {
        return $http.post('/accounts', account);
    };

    this.searchAccounts = function(query) {
        return $http.get('/accounts/search/' + query);
    };
    
    this.getAccounts = function() {
        return $http.get('/accountsFetch');
    };
    
    this.getAccount = function(name) {
        return $http.get('/account/' + name);
    };
}]);
