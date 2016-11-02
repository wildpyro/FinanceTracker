'use strict';

//Setting up route
angular.module('networth').config(['$stateProvider',
	function($stateProvider) {
		// networth state routing
		$stateProvider.
		state('listnetworth', {
			url: '/networth',
			templateUrl: 'modules/networth/views/list-networth.client.view.html'
		}).
		state('createNetworth', {
			url: '/networth/create',
			templateUrl: 'modules/networth/views/create-networth.client.view.html'
		}).
		state('viewNetworth', {
			url: '/networth/:networthId',
			templateUrl: 'modules/networth/views/view-networth.client.view.html'
		}).
		state('editNetworth', {
			url: '/networth/:networthId/edit',
			templateUrl: 'modules/networth/views/edit-networth.client.view.html'
		}).
		state('monthlyListing', {
			url: '/monthlyListing',
			templateUrl: 'modules/networth/views/monthly.client.view.html'
		});
	}
]);