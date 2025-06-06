const IQueue = require('../IQueue');
const sendMail = require('@utils/mailer');

class EmailQueue extends IQueue {
  constructor() {
    super();
    this.name = 'emailQueue';
  }

  initialize(queueService) {
    this.queue = queueService.getQueue('email');
    queueService.process('email', async (options) => {
      await sendMail(options);
    });
  }
}

module.exports = EmailQueue;
