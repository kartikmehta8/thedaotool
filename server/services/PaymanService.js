const Paymanai = require('paymanai');
const FirestoreService = require('./FirestoreService');
const triggerEmail = require('../utils/triggerEmail');

class PaymanService {
  getClient(apiKey) {
    return new Paymanai({ xPaymanAPISecret: apiKey });
  }

  async getApiKey(uid) {
    const businessData = await FirestoreService.getDocument('businesses', uid);
    return businessData?.apiKey || null;
  }

  async createPayee(contractorInfo, apiKey) {
    const payman = this.getClient(apiKey);
    const { name, email, accountNumber, routingNumber } = contractorInfo;

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

  async sendPayment(contract, apiKey) {
    const payman = this.getClient(apiKey);

    await payman.payments.sendPayment({
      amountDecimal: Number(contract.amount),
      payeeId: process.env.PAYMAN_TEST_PAYEE_ID, // For testing
      memo: `Payment for ${contract.name}`,
      metadata: { contractId: contract.id },
    });

    await FirestoreService.updateDocument('contracts', contract.id, {
      paid: true,
    });

    const contractorData = await FirestoreService.getDocument(
      'contractors',
      contract.contractorId
    );

    if (!contractorData) {
      throw new Error('Contractor not found');
    }

    const newBalance = (contractorData.balance || 0) + Number(contract.amount);

    await FirestoreService.updateDocument(
      'contractors',
      contract.contractorId,
      {
        balance: newBalance,
      }
    );

    await triggerEmail('paymentSentToContractor', contract.id, {
      amount: contract.amount,
    });
  }

  async getBalance(apiKey) {
    const payman = this.getClient(apiKey);
    return payman.balances.getSpendableBalance('TSD');
  }
}

module.exports = new PaymanService();
