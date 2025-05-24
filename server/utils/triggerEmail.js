const sendMail = require('./mailer');
const templates = require('../templates/emailTemplates');
const FirestoreService = require('../services/database/FirestoreService');

async function triggerEmail(templateKey, bountyId, extraData = {}) {
  try {
    const bounty = await FirestoreService.getDocument('bounties', bountyId);
    if (!bounty) throw new Error('Bounty not found');

    const contributor = bounty.contributorId
      ? await FirestoreService.getDocument('contributors', bounty.contributorId)
      : {};

    const organization = bounty.organizationId
      ? await FirestoreService.getDocument(
          'organizations',
          bounty.organizationId
        )
      : {};

    const templateFn = templates[templateKey];
    if (!templateFn) throw new Error('Invalid template key');

    const emailData = templateFn({
      contributor,
      bounty: { id: bountyId, ...bounty },
      ...extraData,
    });

    const recipient =
      templateKey === 'paymentSentToContributor'
        ? contributor?.email
        : organization?.email;

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
