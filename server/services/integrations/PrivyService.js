const { PrivyClient } = require('@privy-io/server-auth');
const {
  PublicKey,
  SystemProgram,
  VersionedTransaction,
  TransactionMessage,
  Connection,
} = require('@solana/web3.js');

const APP_ID = process.env.PRIVY_APP_ID;
const APP_SECRET = process.env.PRIVY_APP_SECRET;
const CAIP2 = process.env.SOLANA_CAIP2;
const RPC_URL = process.env.SOLANA_RPC_URL;

class PrivyService {
  constructor() {
    this.client = new PrivyClient(APP_ID, APP_SECRET);
    this.connection = new Connection(RPC_URL, 'recent');
  }

  async createWallet() {
    return this.client.walletApi.createWallet({ chainType: 'solana' });
  }

  async sendSol(walletId, fromAddress, toAddress, lamports, maxRetries = 3) {
    console.log({ walletId, fromAddress, toAddress, lamports, maxRetries });
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const { blockhash } = await this.connection.getLatestBlockhash();

        const payerKey = new PublicKey(fromAddress);
        const instruction = SystemProgram.transfer({
          fromPubkey: payerKey,
          toPubkey: new PublicKey(toAddress),
          lamports: 1000,
        });

        const message = new TransactionMessage({
          payerKey,
          recentBlockhash: blockhash,
          instructions: [instruction],
        }).compileToV0Message();

        const transaction = new VersionedTransaction(message);

        const { hash } =
          await this.client.walletApi.solana.signAndSendTransaction({
            walletId,
            caip2: CAIP2,
            transaction,
          });

        return hash;
      } catch (err) {
        throw err;
      }
    }
  }
}

module.exports = new PrivyService();
