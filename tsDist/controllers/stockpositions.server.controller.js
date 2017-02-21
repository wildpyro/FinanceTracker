'use strict';
/**
 * Module dependencies.
 */
var _ = require('lodash');
/**
 * Add in all the children controllers
 */
module.exports = _.extend(require('./stockpositions/sp.archive.server.controller'), require('./stockpositions/sp.base.server.controller'), require('./stockpositions/sp.details.server.controller'), require('./stockpositions/sp.export.server.controller'), require('./stockpositions/sp.mailer.server.controller'));
//# sourceMappingURL=stockpositions.server.controller.js.map