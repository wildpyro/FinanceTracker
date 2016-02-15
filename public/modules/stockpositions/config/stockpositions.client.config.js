'use strict';

// Configuring the new module
angular.module('stockpositions')
.run(['Menus', function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Stockpositions', 'stockpositions', 'dropdown', '/stockpositions(/create)?');
		Menus.addSubMenuItem('topbar', 'stockpositions', 'List Stockpositions', 'stockpositions');
		Menus.addSubMenuItem('topbar', 'stockpositions', 'New Stockposition', 'stockpositions/create');
	}
]);

angular.module('stockpositions')
.constant('ACCOUNT_TYPES', {
    'OPEN': 0,
    'RSP': 1,
    'RESP': 2,
    'TFSA': 3,
    'JOINT': 4
});

angular.module('stockpositions')
.constant('ACCOUNT_TYPES_1', {function() {

	return [{name: 'RESP', value: 0},
     {name: 'Open', value: 1},
     {name: 'RSP', value: 2},
     {name: 'TFSA', value: 3}];	
	}
});