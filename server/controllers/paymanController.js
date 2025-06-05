const PaymanService = require('../services/integrations/PaymanService');
const ResponseHelper = require('../utils/ResponseHelper');
const FirestoreService = require('../services/database/FirestoreService');

class PaymanController {
  async getApiKey(req, res) {
    const apiKey = await PaymanService.getApiKey(req.params.uid);

    if (!apiKey) {
      return ResponseHelper.error(res, 'Organization not found', 404);
    }

    return ResponseHelper.success(res, 'API Key fetched', { apiKey });
  }

  async createPayee(req, res) {
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
  }

  async sendPayment(req, res) {
    const { bounty, apiKey } = req.body;

    await PaymanService.sendPayment(bounty, apiKey);

    return ResponseHelper.success(res, 'Payment sent successfully');
  }

  async getPaymanBalance(req, res) {
    const apiKey = await PaymanService.getApiKey(req.params.uid);

    if (!apiKey) {
      return ResponseHelper.error(res, 'API key not found', 400);
    }

    const balance = await PaymanService.getBalance(apiKey);

    return ResponseHelper.success(res, 'Balance fetched successfully', {
      balance,
    });
  }
}

module.exports = new PaymanController();
