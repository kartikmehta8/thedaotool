/**
 * @interface ICronJob
 * Defines the contract for all cron jobs.
 */
class ICronJob {
  /**
   * Schedule the cron job.
   */
  schedule() {
    throw new Error('Method schedule() must be implemented.');
  }
}

module.exports = ICronJob;
