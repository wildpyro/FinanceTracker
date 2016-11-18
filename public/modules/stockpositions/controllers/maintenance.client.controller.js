'use strict';

// Stockpositions controller
angular.module('stockpositions').controller('MaintenanceController', ['$scope', '$stateParams', '$location', 'Authentication', '$http', 'MonthlyArchiveForm', 'ExportDataForm', 'ImportDataForm',
	function($scope, $stateParams, $location, Authentication, $http, MonthlyArchiveForm, ExportDataForm, ImportDataForm) {
		var vm = this;
		$scope.authentication = Authentication;

		this.title = 'Position Maintenance';

	    vm.model = {};		
	    vm.options = {formState: {}};
		initMonthlyArchiving();
		initExportData();
		initImportData();

		function initMonthlyArchiving() {
			vm.archive = {};
			vm.archiveFormFields = MonthlyArchiveForm.getFormFields();
		}

		function initExportData() {
			vm.exportData = {};
			vm.exportDataFormFields = ExportDataForm.getFormFields();
		}

		function initImportData() {
			vm.importDataForm = {};
			vm.importDataFormFields = ImportDataForm.getFormFields();
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

		this.importData = function() {			
			//JQuery dependency - wrap this in an angular.element
			var file = document.getElementById('fileToUpload').files[0];

			var formData = new FormData();
			formData.append('file', file, file.name);

			var fileReader = new FileReader();
			fileReader.onload = function(result) {
				$http.post('/maintenance/importStockPositions', {type: vm.importDataForm.type, layout: vm.importDataForm.layout, file: result.target.result})
				.success(function(response) {
					vm.success = response.message;
					vm.options.resetModel();
				})
				.error(function(response) {
					vm.error = response.message;
				});			
			};

			fileReader.readAsText(file);
		}; 		
	}
]);
