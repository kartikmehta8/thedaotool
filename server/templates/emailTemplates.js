module.exports = {
  contractAssignedToBusiness: ({ contractor, contract }) => ({
    subject: `New Contractor Assigned: ${contract.name}`,
    text: `${contractor.name} has been assigned to your contract "${contract.name}".`,
    html: `
      <p><strong>${contractor.name}</strong> has been assigned to your contract <strong>${contract.name}</strong>.</p>
      <p>Contractor Email: ${contractor.email}</p>
    `,
  }),

  paymentSentToContractor: ({ contract, amount }) => ({
    subject: `Payment Sent for Contract: ${contract.name}`,
    text: `A payment of $${amount} has been sent for the contract "${contract.name}".`,
    html: `
      <p>Hi,</p>
      <p>You have received a payment of <strong>$${amount}</strong> for your work on contract <strong>${contract.name}</strong>.</p>
    `,
  }),

  submissionNotificationToBusiness: ({ contractor, contract }) => ({
    subject: `Work Submitted: ${contract.name}`,
    text: `${contractor.name} has submitted work for the contract "${contract.name}".`,
    html: `
      <p><strong>${contractor.name}</strong> has submitted work for the contract <strong>${contract.name}</strong>.</p>
      <p>Contractor Email: ${contractor.email}</p>
      <p>Check your dashboard to review and proceed.</p>
    `,
  }),
};
