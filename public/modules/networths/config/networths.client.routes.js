'use strict';

//Setting up route
angular.module('networths').config(['$stateProvider',
	function($stateProvider) {
		// Networths state routing
		$stateProvider.
		state('listNetworths', {
			url: '/networths',
			templateUrl: 'modules/networths/views/list-networths.client.view.html'
		}).
		state('createNetworth', {
			url: '/networths/create',
			templateUrl: 'modules/networths/views/create-networth.client.view.html'
		}).
		state('viewNetworth', {
			url: '/networths/:networthId',
			templateUrl: 'modules/networths/views/view-networth.client.view.html'
		}).
		state('editNetworth', {
			url: '/networths/:networthId/edit',
			templateUrl: 'modules/networths/views/edit-networth.client.view.html'
		});
	}
]);