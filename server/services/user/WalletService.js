const FirestoreService = require('@services/database/FirestoreService');
const PrivyService = require('@services/integrations/PrivyService');
const { PublicKey } = require('@solana/web3.js');
const TOKEN_PROGRAM_ID = new PublicKey(
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
);

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

  async getPortfolio(uid) {
    const user = await FirestoreService.getDocument('users', uid);
    if (!user?.walletAddress) throw new Error('Wallet not found');
    const owner = new PublicKey(user.walletAddress);
    const accounts =
      await PrivyService.connection.getParsedTokenAccountsByOwner(owner, {
        programId: TOKEN_PROGRAM_ID,
      });
    return accounts.value.map((acc) => {
      const info = acc.account.data.parsed.info;
      return {
        mint: info.mint,
        amount: info.tokenAmount.uiAmount,
      };
    });
  }
}

module.exports = new WalletService();
