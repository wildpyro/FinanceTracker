import { Router, Request, Response, NextFunction } from 'express';
import * as core from '../controllers/core.controller';

export class CoreRouter {
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
    this.router.route('/').get(core.index);
  }
}

//Create a new instance and expose it.
const coreRoutes = new CoreRouter();

export default coreRoutes.router;
