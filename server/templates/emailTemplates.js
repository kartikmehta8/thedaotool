module.exports = {
  bountyAssignedToOrganization: ({ contributor, bounty }) => ({
    subject: `New Contributor Assigned: ${bounty.name}`,
    text: `${contributor.name} has been assigned to your bounty "${bounty.name}".`,
    html: `
      <p><strong>${contributor.name}</strong> has been assigned to your bounty <strong>${bounty.name}</strong>.</p>
      <p>Contributor Email: ${contributor.email}</p>
    `,
  }),

  paymentSentToContributor: ({ bounty, amount }) => ({
    subject: `Payment Sent for Bounty: ${bounty.name}`,
    text: `A payment of $${amount} has been sent for the bounty "${bounty.name}".`,
    html: `
      <p>Hi,</p>
      <p>You have received a payment of <strong>$${amount}</strong> for your work on bounty <strong>${bounty.name}</strong>.</p>
    `,
  }),

  submissionNotificationToOrganization: ({ contributor, bounty }) => ({
    subject: `Work Submitted: ${bounty.name}`,
    text: `${contributor.name} has submitted work for the bounty "${bounty.name}".`,
    html: `
      <p><strong>${contributor.name}</strong> has submitted work for the bounty <strong>${bounty.name}</strong>.</p>
      <p>Contributor Email: ${contributor.email}</p>
      <p>Check your dashboard to review and proceed.</p>
    `,
  }),
};
