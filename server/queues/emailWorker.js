const QueueService = require('./QueueService');
const sendMail = require('@utils/mailer');

QueueService.process('email', async (options) => {
  await sendMail(options);
});

module.exports = QueueService.getQueue('email');
