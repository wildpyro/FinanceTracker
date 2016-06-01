'use strict';

//Setting up route
angular.module('stockpositions').config(['$stateProvider',
	function($stateProvider) {
		// Stockpositions state routing
		$stateProvider.
		state('listStockpositions', {
			url: '/stockpositions',
			templateUrl: 'modules/stockpositions/views/list-stockpositions.client.view.html'
		}).
		state('listStockpositionsByAccount', {
			url: '/stockpositions/:accoountType/list',
			templateUrl: 'modules/stockpositions/views/list-stockpositions.client.view.html'
		}).
		state('createStockposition', {
			url: '/stockpositions/create',
			templateUrl: 'modules/stockpositions/views/create-stockposition.client.view.html'
		}).
		state('viewStockposition', {
			url: '/stockpositions/:stockpositionId',
			templateUrl: 'modules/stockpositions/views/view-stockposition.client.view.html'
		}).
		state('editStockposition', {
			url: '/stockpositions/:stockpositionId/edit',
			templateUrl: 'modules/stockpositions/views/edit-stockposition.client.view.html'
		}).
		state('listTxns', {
			url: '/txns',
			templateUrl: 'modules/stockpositions/views/list-txns.client.view.html'
		});
	}
]);