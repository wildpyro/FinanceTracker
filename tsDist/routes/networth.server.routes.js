'use strict';
module.exports = function (app) {
    var users = require('../../app/controllers/users.server.controller');
    var networth = require('../../app/controllers/networths.server.controller');
    var stockPositions_Archive = require('../../app/controllers/stockpositions.server.controller');
    // Networth Routes
    app.route('/networth')
        .get(users.requiresLogin, networth.list)
        .post(users.requiresLogin, networth.create);
    app.route('/networth/:networthId')
        .get(networth.read)
        .put(users.requiresLogin, networth.hasAuthorization, networth.update)
        .delete(users.requiresLogin, networth.hasAuthorization, networth.delete);
    //Monthly stock listing Routes 
    app.route('/monthlyListing').get(users.requiresLogin, stockPositions_Archive.listArchive);
    // Finish by binding the Networth middleware
    app.param('networthId', networth.networthByID);
};
//# sourceMappingURL=networth.server.routes.js.map