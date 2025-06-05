const Paymanai = require('paymanai');
const FirestoreService = require('../database/FirestoreService');
const EmailService = require('../misc/EmailService');

class PaymanService {
  getClient(apiKey) {
    return new Paymanai({ xPaymanAPISecret: apiKey });
  }

  async getApiKey(uid) {
    const organizationData = await FirestoreService.getDocument(
      'organizations',
      uid
    );
    return organizationData?.apiKey || null;
  }

  async createPayee(contributorInfo, apiKey) {
    const payman = this.getClient(apiKey);
    const { name, email, accountNumber, routingNumber } = contributorInfo;

    return payman.payments.createPayee({
      type: 'US_ACH',
      name,
      accountHolderName: name,
      accountHolderType: 'individual',
      accountNumber,
      routingNumber,
      accountType: 'checking',
      contactDetails: { email },
    });
  }

  async sendPayment(bounty, apiKey) {
    const payman = this.getClient(apiKey);

    await payman.payments.sendPayment({
      amountDecimal: Number(bounty.amount),
      payeeId: process.env.PAYMAN_TEST_PAYEE_ID, // For testing.
      memo: `Payment for ${bounty.name}`,
      metadata: { bountyId: bounty.id },
    });

    await FirestoreService.updateDocument('bounties', bounty.id, {
      paid: true,
    });

    const contributorData = await FirestoreService.getDocument(
      'contributors',
      bounty.contributorId
    );

    if (!contributorData) {
      throw new Error('Contributor not found');
    }

    const newBalance = (contributorData.balance || 0) + Number(bounty.amount);

    await FirestoreService.updateDocument(
      'contributors',
      bounty.contributorId,
      {
        balance: newBalance,
      }
    );

    await EmailService.sendPaymentSentToContributor({
      bountyId: bounty.id,
      amount: bounty.amount,
    });
  }

  async getBalance(apiKey) {
    const payman = this.getClient(apiKey);
    return payman.balances.getSpendableBalance('TSD');
  }
}

module.exports = new PaymanService();
