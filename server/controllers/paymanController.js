const Paymanai = require('paymanai');
const { doc, getDoc, updateDoc } = require('firebase/firestore');
const { db } = require('../utils/firebase');
const triggerEmail = require('../utils/triggerEmail');

const getApiKey = async (req, res) => {
  try {
    const uid = req.params.uid;
    const ref = doc(db, 'businesses', uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const apiKey = snap.data().apiKey;
      return res.status(200).json({ apiKey: apiKey || null });
    }
    res.status(404).json({ message: 'Business not found' });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching API key' });
  }
};

// Currently only works for test payeeId.
const createPayee = async (req, res) => {
  const { contractorInfo, contractorId, apiKey } = req.body;

  try {
    const ref = doc(db, 'contractors', contractorId);

    if (!ref || !contractorInfo) {
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

    await updateDoc(ref, { payeeId: payee.id });

    res
      .status(200)
      .json({ payeeId: payee.id, message: 'Payee created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create payee' });
  }
};

const sendPayment = async (req, res) => {
  const { contract, payeeId, apiKey } = req.body;

  try {
    const payman = new Paymanai({ xPaymanAPISecret: apiKey });
    await payman.payments.sendPayment({
      amountDecimal: Number(contract.amount),
      // payeeId: payeeId,
      payeeId: process.env.PAYMAN_TEST_PAYEE_ID, // for testing.
      memo: `Payment for ${contract.name}`,
      metadata: { contractId: contract.id },
    });

    await triggerEmail('paymentSentToContractor', contract.id, {
      amount: contract.amount,
    });

    res.status(200).json({ message: 'Payment sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send payment' });
  }
};

const getPaymanBalance = async (req, res) => {
  try {
    const uid = req.params.uid;
    const ref = doc(db, 'businesses', uid);
    const snap = await getDoc(ref);
    const apiKey = snap.exists() ? snap.data().apiKey : null;

    if (!apiKey) return res.status(400).json({ message: 'API key not found' });

    const payman = new Paymanai({ xPaymanAPISecret: apiKey });
    const usd = await payman.balances.getSpendableBalance('TSD');

    res.status(200).json({ balance: usd });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch balance' });
  }
};

module.exports = {
  getApiKey,
  createPayee,
  sendPayment,
  getPaymanBalance,
};
