'use strict';

// Accounts controller
angular.module('accounts').controller('AccountsController', ['$scope', '$stateParams', '$location', 'Authentication', 'AccountService', 'AccountsForm', 
	function($scope, $stateParams, $location, Authentication, AccountService, AccountsForm) {
		this.authentication = Authentication;
		this.account = {};
		this.accountsSearch = AccountService.get();
		
//Single Record Functions 
		$scope.setFormFields = function(disabled) {
			$scope.formFields = AccountsForm.getFormFields(disabled);
		};

		// Create new Account from create-account.client.view.html
		$scope.create = function() {
			var account = new AccountService(this.account);

			// Redirect after save
			account.$save(function(response) {
				$location.path('accounts/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Account
		$scope.remove = function(account) {
			if ( account ) {
				account = AccountService.get({accountId:account._id}, function() {
					account.$remove();
					this.tableParams.reload();
				});

			} else {
				this.account.$remove(function() {
					$location.path('accounts');
				});
			}

		};		

		// Update existing Account
		$scope.update = function() {
			var account = $scope.account;

			account.$update(function() {
				$location.path('accounts/' + account._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.toViewAccount = function() {
			this.account = AccountService.get( {accountId: $stateParams.accountId} );
			this.setFormFields(true);
		};

		$scope.toEditAccount = function() {
			this.account = AccountService.get( {accountId: $stateParams.accountId} );
			this.setFormFields(false);
		};


//Listing Functions 
		$scope.formatTitle = function(accountName, accountNo, accountType) {
			var account =  accountName.concat(' ~ ',accountNo);			
			return account;
		};

		$scope.show = function(marketValue) {
			if (marketValue === 0) {
				return false;
			}

			return true;
		};
	}

]);
