'use strict';

// Configuring the new module
angular.module('networths').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Networth', 'networths', 'dropdown', '/networths(/create)?');
		Menus.addSubMenuItem('topbar', 'networths', 'List Networth', 'networths');
		Menus.addSubMenuItem('topbar', 'networths', 'New Networth', 'networths/create');
	}
]);
