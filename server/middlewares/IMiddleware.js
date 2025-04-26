/**
 * @interface IMiddleware
 * Defines the contract for all middleware classes.
 */
class IMiddleware {
  /**
   * Apply the middleware to the app or server.
   * @param {object} app - The Express app or server object.
   */
  apply(app) {
    throw new Error('Method apply() must be implemented.');
  }
}

module.exports = IMiddleware;
