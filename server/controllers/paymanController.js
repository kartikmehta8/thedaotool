const PaymanService = require('../services/integrations/PaymanService');
const ResponseHelper = require('../utils/ResponseHelper');
const FirestoreService = require('../services/database/FirestoreService');

class PaymanController {
  async getApiKey(req, res) {
    try {
      const apiKey = await PaymanService.getApiKey(req.params.uid);

      if (!apiKey) {
        return ResponseHelper.error(res, 'Organization not found', 404);
      }

      return ResponseHelper.success(res, 'API Key fetched', { apiKey });
    } catch (err) {
      return ResponseHelper.error(res, 'Error fetching API key');
    }
  }

  async createPayee(req, res) {
    try {
      const { contributorInfo, contributorId, apiKey } = req.body;

      if (!contributorId || !contributorInfo) {
        return ResponseHelper.error(res, 'Invalid contributor info', 400);
      }

      const payee = await PaymanService.createPayee(contributorInfo, apiKey);

      await FirestoreService.updateDocument('contributors', contributorId, {
        payeeId: payee.id,
      });

      return ResponseHelper.success(res, 'Payee created successfully', {
        payeeId: payee.id,
      });
    } catch (err) {
      return ResponseHelper.error(res, 'Failed to create payee');
    }
  }

  async sendPayment(req, res) {
    try {
      const { bounty, apiKey } = req.body;

      await PaymanService.sendPayment(bounty, apiKey);

      return ResponseHelper.success(res, 'Payment sent successfully');
    } catch (err) {
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
      return ResponseHelper.error(res, 'Failed to fetch balance');
    }
  }
}

module.exports = new PaymanController();
