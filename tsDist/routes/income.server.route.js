'use strict';
module.exports = function (app) {
    var users = require('../../app/controllers/users.server.controller');
    var income = require('../../app/controllers/income.server.controller');
    // Stockpositions Routes
    app.route('/income')
        .get(income.listByDescription)
        .post(users.requiresLogin, income.create);
    //.delete(users.requiresLogin, txns.hasAuthorization, txns.delete); The code is coming from here, not the correct URL?
    app.route('/income/:txnId')
        .get(income.read)
        .put(users.requiresLogin, income.hasAuthorization, income.update)
        .delete(users.requiresLogin, income.hasAuthorization, income.delete);
    // Finish by binding the Stockposition middleware
    app.param('incomeId', income.incomeByID);
};
//# sourceMappingURL=income.server.route.js.map