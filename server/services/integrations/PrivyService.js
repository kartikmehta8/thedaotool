const { PrivyClient } = require('@privy-io/server-auth');
const {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
} = require('@solana/web3.js');

const APP_ID = process.env.PRIVY_APP_ID;
const APP_SECRET = process.env.PRIVY_APP_SECRET;
const CAIP2 = process.env.SOLANA_CAIP2;
const RPC_URL = process.env.SOLANA_RPC_URL;

class PrivyService {
  constructor() {
    this.client = new PrivyClient(APP_ID, APP_SECRET);
    this.connection = new Connection(RPC_URL, 'confirmed');
  }

  async createWallet() {
    return this.client.walletsApi.create({ chainType: 'solana' });
  }

  async sendSol(walletId, fromAddress, toAddress, lamports) {
    const latest = await this.connection.getLatestBlockhash();

    const tx = new Transaction({
      feePayer: new PublicKey(fromAddress),
      recentBlockhash: latest.blockhash,
    }).add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(fromAddress),
        toPubkey: new PublicKey(toAddress),
        lamports,
      })
    );

    const { hash } = await this.client.walletsApi.solana.signAndSendTransaction(
      {
        walletId,
        caip2: CAIP2,
        transaction: tx,
      }
    );

    return hash;
  }
}

module.exports = new PrivyService();
