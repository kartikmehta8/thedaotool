import Paymanai from 'paymanai';
import toast from '../utils/toast';

import { doc, getDoc } from 'firebase/firestore';
import { db } from '../providers/firebase';

export const createPayee = async (
  contractorInfo,
  apiKey,
  contractorId,
  updateContractorData
) => {
  try {
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

    await updateContractorData(contractorId, { payeeId: payee.id });
    toast.success(`Payee created and saved for ${name}`);
    return payee.id;
  } catch (err) {
    toast.error('Failed to create payee');
    throw err;
  }
};

export const sendPayment = async (contract, payeeId, apiKey) => {
  try {
    const payman = new Paymanai({ xPaymanAPISecret: apiKey });
    await payman.payments.sendPayment({
      amountDecimal: Number(contract.amount),
      payeeId: process.env.REACT_APP_PAYMAN_TEST_PAYEE_ID, // Test Payee ID.
      memo: `Payment for ${contract.name}`,
      metadata: { contractId: contract.id },
    });
    toast.success('Payment sent successfully');
  } catch (err) {
    toast.error('Failed to send payment');
    throw err;
  }
};

export const getApiKey = async (uid) => {
  try {
    const ref = doc(db, 'businesses', uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return snap.data().apiKey || null;
    }
    return null;
  } catch (err) {
    toast.error('Error fetching API key');
    return null;
  }
};

export const getPaymanBalance = async (uid) => {
  const apiKey = await getApiKey(uid);
  if (!apiKey) {
    toast.warning('No Payman API key found.');
    return null;
  }
  try {
    const payman = new Paymanai({ xPaymanAPISecret: apiKey });
    const usd = await payman.balances.getSpendableBalance('TSD');
    return usd;
  } catch (err) {
    toast.error('Error fetching Payman balance');
    return null;
  }
};
