'use strict';

// Accounts controller
angular.module('accounts').controller('AccountsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Accounts', 'TableSettings', 'AccountsForm',
	function($scope, $stateParams, $location, Authentication, Accounts, TableSettings, AccountsForm ) {
		$scope.authentication = Authentication;
		$scope.tableParams = TableSettings.getParams(Accounts);
		$scope.account = {};

		$scope.setFormFields = function(disabled) {
			$scope.formFields = AccountsForm.getFormFields(disabled);
		};


		// Create new Account from create-account.client.view.html
		$scope.create = function() {
			var account = new Accounts($scope.account);

			console.log($scope.account);

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
			var account =  accountName.concat(' ',accountType,' - ',' ~ ',accountNo); 
			//console.log($scope);
			return account;
		};

		$scope.calcBalance = function(accountId) {
			//var stockpostions = Accounts.get( {accountId: $stateParams.accountId} ).stockpostions;
			/*for (var i = stockpostions.length - 1; i >= 0; i--) {
				console.log(stockpostions[i]);
			};*/
			//console.log(stockpostions);
			return 0.00; 
		};
	}

]);
