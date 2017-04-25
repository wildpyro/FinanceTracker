import { Router, Request, Response, NextFunction } from 'express';
import * as user from '../controllers/user.controller';

const account = require('../../app/controllers/account.controller');

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
    this.router.route('/account')
      .get(account.list)
      .post(user.requiresLogin, account.create);

    this.router.route('/accountFetch')
      .get(user.requiresLogin, account.hasAuthorization, account.list);

    this.router.route('/account/fetchAccountNo')
      .get(account.fetchAccountNos);

    this.router.route('/account/:accountId')
      .get(account.read)
      //.put(users.requiresLogin, account.hasAuthorization, account.update)
      .put(user.requiresLogin, account.update)
      .delete(user.requiresLogin, account.hasAuthorization, account.delete);

    // Finish by binding to the middleware
    this.router.param('accountId', account.accountByID);
  }

}

//Create a new instance and expose it.
const accountRoutes = new AccountRouter();

export default accountRoutes.router;
