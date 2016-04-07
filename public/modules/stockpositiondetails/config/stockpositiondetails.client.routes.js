'use strict';

//Setting up route
angular.module('stockpositiondetails').config(['$stateProvider',
	function($stateProvider) {
		// Stockpositiondetails state routing
		$stateProvider.
		state('listStockpositiondetails', {
			url: '/stockpositiondetails',
			templateUrl: 'modules/stockpositiondetails/views/list-stockpositiondetails.client.view.html'
		}).
		state('createStockpositiondetail', {
			url: '/stockpositiondetails/create',
			templateUrl: 'modules/stockpositiondetails/views/create-stockpositiondetail.client.view.html'
		}).
		state('viewStockpositiondetail', {
			url: '/stockpositiondetails/:stockpositiondetailId',
			templateUrl: 'modules/stockpositiondetails/views/view-stockpositiondetail.client.view.html'
		}).
		state('editStockpositiondetail', {
			url: '/stockpositiondetails/:stockpositiondetailId/edit',
			templateUrl: 'modules/stockpositiondetails/views/edit-stockpositiondetail.client.view.html'
		});
	}
]);