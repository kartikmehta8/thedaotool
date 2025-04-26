import { API_URL } from '../constants/constants';

export const getApiKey = async (uid) => {
  const res = await fetch(`${API_URL}/payman/key/${uid}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.apiKey || null;
};

export const createPayee = async (contractorInfo, apiKey, contractorId) => {
  const res = await fetch(`${API_URL}/payman/payee`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contractorInfo, contractorId, apiKey }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create payee');
  return data.payeeId;
};

export const sendPayment = async (contract, payeeId, apiKey) => {
  const res = await fetch(`${API_URL}/payman/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contract, payeeId, apiKey }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to send payment');
  return true;
};

export const getPaymanBalance = async (uid) => {
  const apiKey = await getApiKey(uid);
  if (!apiKey) return null;

  const res = await fetch(`${API_URL}/payman/balance/${uid}`);
  if (!res.ok) return null;

  const data = await res.json();
  return data.balance || null;
};
