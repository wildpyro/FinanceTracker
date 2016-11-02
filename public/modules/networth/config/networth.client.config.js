'use strict';

// Configuring the new module
angular.module('networth').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Networth', 'networth', 'dropdown', '/networth(/create)?');
		Menus.addSubMenuItem('topbar', 'networth', 'List Networth', 'networth');
		Menus.addSubMenuItem('topbar', 'networth', 'Monthly Listing', 'monthlyListing');
		Menus.addSubMenuItem('topbar', 'networth', 'New Networth', 'networth/create');
	}
]);
