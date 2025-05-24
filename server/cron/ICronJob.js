/**
 * @interface ICronJob
 * Defines the interface for all cron jobs.
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
