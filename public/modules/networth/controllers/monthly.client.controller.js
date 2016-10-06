'use strict';

// Stockpositions controller
angular.module('networth').controller('monthlyController', ['MonthlyStats', function(MonthlyStats) {
		var vm = this;
		
		this.title = 'Historical Returns';
		vm.monthlystats = MonthlyStats.query();
		vm.isLoading = false;
	}
]);        