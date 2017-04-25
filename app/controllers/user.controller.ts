import * as _ from 'lodash';

/**
 * Extend user's controller
 */
export = _.extend(
	require('./users/users.authentication.server.controller'),
	require('./users/users.authorization.server.controller'),
	require('./users/users.password.server.controller'),
	require('./users/users.profile.server.controller')
);
