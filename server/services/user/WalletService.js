const FirestoreService = require('@services/database/FirestoreService');
const PrivyService = require('@services/integrations/PrivyService');
const { PublicKey } = require('@solana/web3.js');

class WalletService {
  async getBalance(uid) {
    const user = await FirestoreService.getDocument('users', uid);
    if (!user?.walletAddress) throw new Error('Wallet not found');
    const balance = await PrivyService.connection.getBalance(
      new PublicKey(user.walletAddress)
    );
    return balance / 1e9;
  }

  async send(uid, toAddress, sol) {
    const user = await FirestoreService.getDocument('users', uid);
    if (!user?.walletId || !user?.walletAddress) {
      throw new Error('Wallet not configured');
    }
    const lamports = Math.round(sol * 1e9);
    return PrivyService.sendSol(
      user.walletId,
      user.walletAddress,
      toAddress,
      lamports
    );
  }
}

module.exports = new WalletService();
