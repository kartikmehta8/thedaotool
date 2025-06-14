const { ethers } = require('ethers');

class PrivyService {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.PRIVY_RPC_URL);
  }

  createWallet() {
    const wallet = ethers.Wallet.createRandom();
    return { address: wallet.address, privateKey: wallet.privateKey };
  }

  async sendPayment(privateKey, toAddress, amount) {
    const wallet = new ethers.Wallet(privateKey, this.provider);
    const tx = await wallet.sendTransaction({
      to: toAddress,
      value: ethers.parseEther(String(amount)),
    });
    await tx.wait();
    return tx.hash;
  }
}

module.exports = new PrivyService();
