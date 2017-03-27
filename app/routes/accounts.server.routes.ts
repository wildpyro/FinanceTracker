/**
 * Account router for REST endpoints
 */

'use strict';

import { Router, Request, Response, NextFunction } from 'express';

const users = require('../../app/controllers/users.server.controller');
const accounts = require('../../app/controllers/accounts.server.controller');

export class AccountRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.route('/accounts')
      .get(accounts.list)
      .post(users.requiresLogin, accounts.create);

    this.router.route('/accountsFetch')
      .get(users.requiresLogin, accounts.hasAuthorization, accounts.list);

    this.router.route('/accounts/fetchAccountNo')
      .get(accounts.fetchAccountNos);

    this.router.route('/accounts/:accountId')
      .get(accounts.read)
      //.put(users.requiresLogin, accounts.hasAuthorization, accounts.update)
      .put(users.requiresLogin, accounts.update)
      .delete(users.requiresLogin, accounts.hasAuthorization, accounts.delete);

    // Finish by binding to the middleware
    this.router.param('accountId', accounts.accountByID);
  }

}

//Create a new instance and expose it.
const accountRoutes = new AccountRouter();
accountRoutes.init();

export default accountRoutes.router;
