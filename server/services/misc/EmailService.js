const sendMail = require('../../utils/mailer');
const FirestoreService = require('../database/FirestoreService');

class EmailService {
  async sendVerificationEmail({ to, token }) {
    const html = `
      <p>Please verify your email using the token below:</p>
      <strong>${token}</strong>
      <p>This token expires in 15 minutes.</p>
    `;

    return sendMail({
      to,
      subject: 'Verify Your Email – The DAO Tool',
      text: `Verify your email`,
      html,
    });
  }

  async sendForgotPasswordEmail({ to, token }) {
    const html = `
      <p>You requested a password reset. The token is:</p>
      <p><strong>${token}</strong></p>
      <p>This token will expire in 15 minutes. If you didn’t request this, you can ignore the message.</p>
    `;

    return sendMail({
      to,
      subject: 'Password Reset – The DAO Tool',
      text: `Reset your password`,
      html,
    });
  }

  async sendBountyAssignedToOrganization({ bountyId, contributorId }) {
    try {
      const bounty = await FirestoreService.getDocument('bounties', bountyId);
      if (!bounty) throw new Error('Bounty not found');

      const contributor =
        contributorId || bounty.contributorId
          ? await FirestoreService.getDocument(
              'contributors',
              contributorId || bounty.contributorId
            )
          : {};

      const organization = bounty.organizationId
        ? await FirestoreService.getDocument(
            'organizations',
            bounty.organizationId
          )
        : {};

      const recipient = organization?.email;
      if (!recipient) throw new Error('No recipient found for email');

      const html = `
        <p><strong>${contributor.name}</strong> has been assigned to your bounty <strong>${bounty.name}</strong>.</p>
        <p>Contributor Email: ${contributor.email}</p>
      `;

      return sendMail({
        to: recipient,
        subject: `New Contributor Assigned: ${bounty.name}`,
        text: `${contributor.name} has been assigned to your bounty "${bounty.name}".`,
        html,
      });
    } catch (err) {
      return false;
    }
  }

  async sendSubmissionNotificationToOrganization({ bountyId, submittedLink }) {
    try {
      const bounty = await FirestoreService.getDocument('bounties', bountyId);
      if (!bounty) throw new Error('Bounty not found');

      const contributor = bounty.contributorId
        ? await FirestoreService.getDocument(
            'contributors',
            bounty.contributorId
          )
        : {};

      const organization = bounty.organizationId
        ? await FirestoreService.getDocument(
            'organizations',
            bounty.organizationId
          )
        : {};

      const recipient = organization?.email;
      if (!recipient) throw new Error('No recipient found for email');

      const html = `
        <p><strong>${contributor.name}</strong> has submitted work for the bounty <strong>${bounty.name}</strong>.</p>
        <p>Contributor Email: ${contributor.email}</p>
        <p>Check your dashboard to review and proceed.</p>
      `;

      return sendMail({
        to: recipient,
        subject: `Work Submitted: ${bounty.name}`,
        text: `${contributor.name} has submitted work for the bounty "${bounty.name}".`,
        html,
      });
    } catch (err) {
      return false;
    }
  }

  async sendPaymentSentToContributor({ bountyId, amount }) {
    try {
      const bounty = await FirestoreService.getDocument('bounties', bountyId);
      if (!bounty) throw new Error('Bounty not found');

      const contributor = bounty.contributorId
        ? await FirestoreService.getDocument(
            'contributors',
            bounty.contributorId
          )
        : {};

      const recipient = contributor?.email;
      if (!recipient) throw new Error('No recipient found for email');

      const html = `
        <p>Hi,</p>
        <p>You have received a payment of <strong>$${amount}</strong> for your work on bounty <strong>${bounty.name}</strong>.</p>
      `;

      return sendMail({
        to: recipient,
        subject: `Payment Sent for Bounty: ${bounty.name}`,
        text: `A payment of $${amount} has been sent for the bounty "${bounty.name}".`,
        html,
      });
    } catch (err) {
      return false;
    }
  }
}

module.exports = new EmailService();
