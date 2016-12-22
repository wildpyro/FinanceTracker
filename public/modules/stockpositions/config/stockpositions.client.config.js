'use strict';

// Configuring the new module
angular.module('stockpositions').run(['Menus', function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Stockpositions', 'stockpositions', 'dropdown', '/stockpositions(/create)?');
		Menus.addSubMenuItem('topbar', 'stockpositions', 'Stockpositions', 'stockpositions');
		Menus.addSubMenuItem('topbar', 'stockpositions', 'Transaction History', 'txns');
		Menus.addSubMenuItem('topbar', 'stockpositions', 'Gain/Loss Information', 'gainloss');
		Menus.addSubMenuItem('topbar', 'stockpositions', 'Income and Distributions', 'income');
		Menus.addSubMenuItem('topbar', 'stockpositions', 'New Stockposition', 'stockpositions/create');
		Menus.addSubMenuItem('topbar', 'stockpositions', 'Position Maintenance', 'maintenance');
	}
]);

angular.module('stockpositions').value('module', 'stockpositions');
