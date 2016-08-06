'use strict';

// Stockpositions controller
angular.module('stockpositions').controller('MaintenanceController', ['$scope', '$stateParams', '$location', 'Authentication', '$http', 'MonthlyArchiveForm', 'ExportDataForm',
	function($scope, $stateParams, $location, Authentication, $http, MonthlyArchiveForm, ExportDataForm) {
		var vm = this;
		$scope.authentication = Authentication;

		this.title = 'Position Maintenance';

	    vm.model = {};		
	    vm.options = {formState: {}};		
//	    vm.status = null;

		initMonthlyArchiving();
		initExportData();

		function initMonthlyArchiving() {
			vm.archive = {};
			vm.archiveFormFields = MonthlyArchiveForm.getFormFields();
		}

		function initExportData() {
			vm.exportData = {};
			vm.exportDataFormFields = ExportDataForm.getFormFields();
		}

		this.monthlyArchive = function() {

			$http.post('/maintenance/monthlyReporting', {month: vm.archive.month, year: vm.archive.year})
			.success(function(response) {
				vm.success = response.message;
				vm.options.resetModel();
			})
			.error(function(response) {
				vm.error = response.message;
			});			
		};		

		this.exportData = function() {
			
			$http.post('/maintenance/exportData')
			.success(function(response) {
				vm.success = response.message;
				vm.options.resetModel();
			})
			.error(function(response) {
				vm.error = response.message;
			});			
		}; 
	}
]);
