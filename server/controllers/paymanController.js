const Paymanai = require('paymanai');
const FirestoreService = require('../services/FirestoreService');
const triggerEmail = require('../utils/triggerEmail');

class PaymanController {
  async getApiKey(req, res) {
    try {
      const uid = req.params.uid;
      const businessData = await FirestoreService.getDocument(
        'businesses',
        uid
      );

      if (businessData) {
        const apiKey = businessData.apiKey || null;
        return res.status(200).json({ apiKey });
      }

      res.status(404).json({ message: 'Business not found' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching API key' });
    }
  }

  async createPayee(req, res) {
    const { contractorInfo, contractorId, apiKey } = req.body;

    try {
      if (!contractorId || !contractorInfo) {
        return res.status(400).json({ message: 'Invalid information' });
      }

      const payman = new Paymanai({ xPaymanAPISecret: apiKey });
      const { name, email, accountNumber, routingNumber } = contractorInfo;

      const payee = await payman.payments.createPayee({
        type: 'US_ACH',
        name,
        accountHolderName: name,
        accountHolderType: 'individual',
        accountNumber,
        routingNumber,
        accountType: 'checking',
        contactDetails: { email },
      });

      await FirestoreService.updateDocument('contractors', contractorId, {
        payeeId: payee.id,
      });

      res
        .status(200)
        .json({ payeeId: payee.id, message: 'Payee created successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to create payee' });
    }
  }

  async sendPayment(req, res) {
    const { contract, payeeId, apiKey } = req.body;

    try {
      const payman = new Paymanai({ xPaymanAPISecret: apiKey });

      await payman.payments.sendPayment({
        amountDecimal: Number(contract.amount),
        payeeId: process.env.PAYMAN_TEST_PAYEE_ID, // For testing.
        memo: `Payment for ${contract.name}`,
        metadata: { contractId: contract.id },
      });

      // Update the contract to mark it as paid.
      await FirestoreService.updateDocument('contracts', contract.id, {
        paid: true,
      });

      // Update the contractor's balance.
      const contractorData = await FirestoreService.getDocument(
        'contractors',
        contract.contractorId
      );

      if (!contractorData) {
        return res.status(404).json({ message: 'Contractor not found' });
      }

      const newBalance =
        (contractorData.balance || 0) + Number(contract.amount);

      await FirestoreService.updateDocument(
        'contractors',
        contract.contractorId,
        { balance: newBalance }
      );

      await triggerEmail('paymentSentToContractor', contract.id, {
        amount: contract.amount,
      });

      res.status(200).json({ message: 'Payment sent successfully' });
    } catch (err) {
      console.error('Send Payment Error:', err.message);
      res.status(500).json({ message: 'Failed to send payment' });
    }
  }

  async getPaymanBalance(req, res) {
    try {
      const uid = req.params.uid;
      const businessData = await FirestoreService.getDocument(
        'businesses',
        uid
      );

      if (!businessData || !businessData.apiKey) {
        return res.status(400).json({ message: 'API key not found' });
      }

      const payman = new Paymanai({ xPaymanAPISecret: businessData.apiKey });
      const usd = await payman.balances.getSpendableBalance('TSD');

      res.status(200).json({ balance: usd });
    } catch (err) {
      console.error('Fetch Payman Balance Error:', err.message);
      res.status(500).json({ message: 'Failed to fetch balance' });
    }
  }
}

module.exports = new PaymanController();
