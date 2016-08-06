'use strict';

// Configuring the new module
angular.module('stockpositions').run(['Menus', function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Stockpositions', 'stockpositions', 'dropdown', '/stockpositions(/create)?');
		Menus.addSubMenuItem('topbar', 'stockpositions', 'List Stockpositions', 'stockpositions');
		Menus.addSubMenuItem('topbar', 'stockpositions', 'New Stockposition', 'stockpositions/create');
		Menus.addSubMenuItem('topbar', 'stockpositions', 'List Trades and Transactions', 'txns');
		Menus.addSubMenuItem('topbar', 'stockpositions', 'Position Maintenance', 'maintenance');
	}
]);

angular.module('stockpositions').value('module', 'stockpositions');