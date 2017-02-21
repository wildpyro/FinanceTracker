'use strict';
module.exports = function (app) {
    var users = require('../../app/controllers/users.server.controller');
    var txns = require('../../app/controllers/txns.server.controller');
    // Stockpositions Routes
    app.route('/txns')
        .get(txns.list)
        .post(users.requiresLogin, txns.create);
    //.delete(users.requiresLogin, txns.hasAuthorization, txns.delete); The code is coming from here, not the correct URL?
    app.route('/txns/:txnId')
        .get(txns.read)
        .put(users.requiresLogin, txns.hasAuthorization, txns.update)
        .delete(users.requiresLogin, txns.hasAuthorization, txns.delete);
    // Finish by binding the Stockposition middleware
    app.param('txnId', txns.txnByID);
};
//# sourceMappingURL=txns.server.route.js.map