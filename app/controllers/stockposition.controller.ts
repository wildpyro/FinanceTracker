import * as _ from 'lodash';

/**
 * Add in all the children controllers
 */
export = _.extend(
	require('./stockposition/sp.archive.server.controller'),
	require('./stockposition/sp.base.server.controller'),
	require('./stockposition/sp.details.server.controller'),
	require('./stockposition/sp.export.server.controller'),
	require('./stockposition/sp.mailer.server.controller')
);
