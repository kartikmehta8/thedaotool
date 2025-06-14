const WalletService = require('@services/user/WalletService');
const ResponseHelper = require('@utils/ResponseHelper');

class WalletController {
  async getBalance(req, res) {
    const { uid } = req.user;
    const balance = await WalletService.getBalance(uid);
    return ResponseHelper.success(res, 'Balance fetched', { balance });
  }

  async send(req, res) {
    const { uid } = req.user;
    const { toAddress, amount } = req.body;
    const txHash = await WalletService.send(uid, toAddress, Number(amount));
    return ResponseHelper.success(res, 'Transaction sent', { txHash });
  }
}

module.exports = new WalletController();
