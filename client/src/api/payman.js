import toast from '../utils/toast';
import { API_URL } from '../constants/constants';

export const getApiKey = async (uid) => {
  try {
    const res = await fetch(`${API_URL}/payman/key/${uid}`);
    const data = await res.json();
    return data.apiKey || null;
  } catch (err) {
    toast.error('Error fetching API key');
    return null;
  }
};

export const createPayee = async (
  contractorInfo,
  apiKey,
  contractorId,
  updateContractorData
) => {
  try {
    const res = await fetch(`${API_URL}/payman/payee`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contractorInfo, contractorId, apiKey }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(data.message);
      throw new Error(data.message || 'Failed to create payee');
    }

    await updateContractorData(contractorId, { payeeId: data.payeeId });

    toast.success(`Payee created and saved for ${contractorInfo.name}`);
    return data.payeeId;
  } catch (err) {
    toast.error('Failed to create payee');
    throw err;
  }
};

export const sendPayment = async (contract, payeeId, apiKey) => {
  try {
    const res = await fetch(`${API_URL}/payman/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contract, payeeId, apiKey }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Failed to send payment');

    toast.success('Payment sent successfully');
  } catch (err) {
    toast.error('Failed to send payment');
    throw err;
  }
};

export const getPaymanBalance = async (uid) => {
  const apiKey = await getApiKey(uid);
  if (!apiKey) {
    toast.warning('No Payman API key found.');
    return null;
  }
  try {
    const res = await fetch(`${API_URL}/payman/balance/${uid}`);
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Failed to fetch balance');

    return data.balance;
  } catch (err) {
    toast.error('Error fetching Payman balance');
    return null;
  }
};
