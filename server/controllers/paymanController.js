const PaymanService = require('../services/PaymanService');
const ResponseHelper = require('../utils/ResponseHelper');
const FirestoreService = require('../services/FirestoreService');

class PaymanController {
  async getApiKey(req, res) {
    try {
      const apiKey = await PaymanService.getApiKey(req.params.uid);

      if (!apiKey) {
        return ResponseHelper.error(res, 'Business not found', 404);
      }

      return ResponseHelper.success(res, 'API Key fetched', { apiKey });
    } catch (err) {
      console.error('Get API Key Error:', err.message);
      return ResponseHelper.error(res, 'Error fetching API key');
    }
  }

  async createPayee(req, res) {
    try {
      const { contractorInfo, contractorId, apiKey } = req.body;

      if (!contractorId || !contractorInfo) {
        return ResponseHelper.error(res, 'Invalid contractor info', 400);
      }

      const payee = await PaymanService.createPayee(contractorInfo, apiKey);

      await FirestoreService.updateDocument('contractors', contractorId, {
        payeeId: payee.id,
      });

      return ResponseHelper.success(res, 'Payee created successfully', {
        payeeId: payee.id,
      });
    } catch (err) {
      console.error('Create Payee Error:', err.message);
      return ResponseHelper.error(res, 'Failed to create payee');
    }
  }

  async sendPayment(req, res) {
    try {
      const { contract, apiKey } = req.body;

      await PaymanService.sendPayment(contract, apiKey);

      return ResponseHelper.success(res, 'Payment sent successfully');
    } catch (err) {
      console.error('Send Payment Error:', err.message);
      return ResponseHelper.error(res, 'Failed to send payment');
    }
  }

  async getPaymanBalance(req, res) {
    try {
      const apiKey = await PaymanService.getApiKey(req.params.uid);

      if (!apiKey) {
        return ResponseHelper.error(res, 'API key not found', 400);
      }

      const balance = await PaymanService.getBalance(apiKey);

      return ResponseHelper.success(res, 'Balance fetched successfully', {
        balance,
      });
    } catch (err) {
      console.error('Get Payman Balance Error:', err.message);
      return ResponseHelper.error(res, 'Failed to fetch balance');
    }
  }
}

module.exports = new PaymanController();
