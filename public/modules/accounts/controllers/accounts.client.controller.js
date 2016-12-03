'use strict';

// Accounts controller
angular.module('accounts').controller('AccountsController', ['$scope', '$stateParams', '$location', 'Authentication', 'AccountService', 'AccountsForm', '$mdSidenav', '$mdDialog',
	function($scope, $stateParams, $location, Authentication, AccountService, AccountsForm, $mdSidenav, $mdDialog) {
		var vm = this; 
		this.authentication = Authentication;
		this.account = {};
		vm.accountsSearch = AccountService.get();

		$scope.toggleLeft = buildToggler('left');

		function buildToggler(componentId) {
			return function() {$mdSidenav(componentId).toggle();};
		}

		
//Single Record Functions 
		this.setFormFields = function(disabled) {

			this.formFields = AccountsForm.getFormFields(disabled);
		};

		// Create new Account from create-account.client.view.html
		this.create = function() {
			var account = new AccountService(this.account);

			// Redirect after save
			account.$save(function(response) {
				$location.path('accounts/' + response._id);},  function(errorResponse) {
				vm.error = errorResponse.data.message;
			});
		};

		// Remove existing Account
		this.remove = function(account) {
			if ( account ) {
				account = AccountService.get({accountId:account._id}, function() {
					account.$remove();
					this.tableParams.reload();
				});
			} 
			else {
				this.account.$remove(function() {
					$location.path('accounts');
				});
			}
		};		

		// Update existing Account
		this.update = function() {
			var account = vm.account;

			account.$update(
				function() {$location.path('accounts/' + account._id);}, 
				function(errorResponse) {vm.error = errorResponse.data.message;});
		};

		this.toViewAccount = function() {
			this.account = AccountService.get( {accountId: $stateParams.accountId} );
			this.setFormFields(true, true);
		};

		this.toEditAccount = function() {
			this.account = AccountService.get( {accountId: $stateParams.accountId} );
			this.setFormFields(false, false);
		};

//Listing Functions 
		this.formatTitle = function(accountName, accountNo) {
			var account =  accountName.concat(' ~ ',accountNo);			
			return account;
		};

		this.show = function(marketValue) {
			if (marketValue === 0) {
				return false;
			}

			return true;
		};
	}

]);
