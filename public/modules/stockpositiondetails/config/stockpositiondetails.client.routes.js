'use strict';

//Setting up route
angular.module('stockpositiondetails').config(['$stateProvider',
	function($stateProvider) {
		// Stockpositiondetails state routing create different routes for different views. 
		$stateProvider
		.state('spd', {
			url: '/stockpositiondetails/:symbol',
			views: {
				'': {
					templateUrl: 'modules/stockpositiondetails/views/spd.client.view.html',
					controller: 'StockpositiondetailsController as ctrl'
				}
			}
		})
		.state('spd.home', {
			views: {
				'': {
					templateUrl: 'modules/stockpositiondetails/views/home/spd.home.client.view.html',
					controller: 'StockpositiondetailsController as ctrl'
				}
			}
		})
		.state('spd.performance', {
			views: {
				'': {
					templateUrl: 'modules/stockpositiondetails/views/performance/spd.performance.client.view.html',
					controller: 'StockpositiondetailsController as ctrl'
				}
			}
		})
		.state('spd.fundamentals', {
			views: {
				'': {
					templateUrl: 'modules/stockpositiondetails/views/fundamentals/spd.fundamentals.client.view.html',
					controller: 'StockpositiondetailsController as ctrl'
				}
			}
		}); 
	}
]);