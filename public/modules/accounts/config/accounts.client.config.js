'use strict';

// Configuring the new module
angular.module('accounts').run(['Menus', function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Accounts', 'accounts', 'dropdown', '/accounts(/create)?');
		Menus.addSubMenuItem('topbar', 'accounts', 'List Accounts', 'accounts');
	}
]);

angular.module('accounts').value('module', 'accounts');
