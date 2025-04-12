const sendMail = require('./mailer');
const templates = require('../templates/emailTemplates');
const { db } = require('./firebase');
const { doc, getDoc } = require('firebase/firestore');

async function triggerEmail(templateKey, contractId, extraData = {}) {
  try {
    const contractSnap = await getDoc(doc(db, 'contracts', contractId));
    if (!contractSnap.exists()) throw new Error('Contract not found');

    const contract = { id: contractId, ...contractSnap.data() };
    const contractorSnap = await getDoc(
      doc(db, 'contractors', contract.contractorId)
    );
    const businessSnap = await getDoc(
      doc(db, 'businesses', contract.businessId)
    );

    const contractor = contractorSnap.exists() ? contractorSnap.data() : {};
    const business = businessSnap.exists() ? businessSnap.data() : {};

    const templateFn = templates[templateKey];
    if (!templateFn) throw new Error('Invalid template key');

    const emailData = templateFn({ contractor, contract, ...extraData });

    const recipient =
      templateKey === 'paymentSentToContractor'
        ? contractor.email
        : business.email;

    return await sendMail({
      to: recipient,
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.html,
    });
  } catch (err) {
    console.error('❌ Email trigger failed:', err.message);
    return false;
  }
}

module.exports = triggerEmail;
