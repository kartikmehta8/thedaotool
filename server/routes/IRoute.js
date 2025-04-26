/**
 * @interface IRoute
 * Defines the contract for all route classes.
 */
class IRoute {
  /**
   * Apply the route to the Express app.
   * @param {object} app - The Express app instance.
   */
  register(app) {
    throw new Error('Method register() must be implemented.');
  }
}

module.exports = IRoute;
