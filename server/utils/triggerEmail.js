const sendMail = require('./mailer');
const templates = require('../templates/emailTemplates');
const FirestoreService = require('../services/database/FirestoreService');

async function triggerEmail(templateKey, contractId, extraData = {}) {
  try {
    const contract = await FirestoreService.getDocument(
      'contracts',
      contractId
    );
    if (!contract) throw new Error('Contract not found');

    const contractor = contract.contractorId
      ? await FirestoreService.getDocument('contractors', contract.contractorId)
      : {};

    const business = contract.businessId
      ? await FirestoreService.getDocument('businesses', contract.businessId)
      : {};

    const templateFn = templates[templateKey];
    if (!templateFn) throw new Error('Invalid template key');

    const emailData = templateFn({
      contractor,
      contract: { id: contractId, ...contract },
      ...extraData,
    });

    const recipient =
      templateKey === 'paymentSentToContractor'
        ? contractor?.email
        : business?.email;

    if (!recipient) throw new Error('No recipient found for email');

    return await sendMail({
      to: recipient,
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.html,
    });
  } catch (err) {
    return false;
  }
}

module.exports = triggerEmail;
