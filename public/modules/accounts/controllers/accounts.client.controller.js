'use strict';

// Accounts controller
angular.module('accounts').controller('AccountsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Accounts', 
															 'TableSettings', 'AccountsForm', 'Stockpositions',
	function($scope, $stateParams, $location, Authentication, Accounts, TableSettings, AccountsForm, Stockpositions) {
		$scope.authentication = Authentication;
		$scope.tableParams = TableSettings.getParams(Stockpositions);
		$scope.account = {};
		$scope.accounts = Accounts;
		$scope.accountsSeach = Accounts.get();

		$scope.setFormFields = function(disabled) {
			$scope.formFields = AccountsForm.getFormFields(disabled);
		};

		// Create new Account from create-account.client.view.html
		$scope.create = function() {
			var account = new Accounts($scope.account);

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
				account = Accounts.get({accountId:account._id}, function() {
					account.$remove();
					$scope.tableParams.reload();
				});

			} else {
				$scope.account.$remove(function() {
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
			$scope.account = Accounts.get( {accountId: $stateParams.accountId} );
			$scope.setFormFields(true);
		};

		$scope.toEditAccount = function() {
			$scope.account = Accounts.get( {accountId: $stateParams.accountId} );
			$scope.setFormFields(false);
		};

		$scope.formatTitle = function(accountName, accountNo, accountType) {
			var account =  accountName.concat(' ~ ',accountNo); 
			return account;
		};

		$scope.calcBalance = function(accountId) {

			return 0.00; 
		};

		$scope.getVal = function(stockposition) {
			if (stockposition[0] === undefined) {
				return;	
			}

			console.log(stockposition[0]);
		};

		$scope.getAccounts = function() {
			$scope.accountsSearch = Accounts.get();
		};
	}

]);
