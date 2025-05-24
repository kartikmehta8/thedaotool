import { API_URL } from '../constants/constants';
import { fetchWithAuth } from '../utils/fetchWithAuth';

export const getApiKey = async (uid) => {
  const res = await fetchWithAuth(`${API_URL}/payman/key/${uid}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.apiKey || null;
};

export const createPayee = async (contributorInfo, apiKey, contributorId) => {
  const res = await fetchWithAuth(`${API_URL}/payman/payee`, {
    method: 'POST',
    body: JSON.stringify({ contributorInfo, contributorId, apiKey }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create payee');
  return data.payeeId;
};

export const sendPayment = async (bounty, payeeId, apiKey) => {
  const res = await fetchWithAuth(`${API_URL}/payman/send`, {
    method: 'POST',
    body: JSON.stringify({ bounty, payeeId, apiKey }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to send payment');
  return true;
};

export const getPaymanBalance = async (uid) => {
  const apiKey = await getApiKey(uid);
  if (!apiKey) return null;

  const res = await fetchWithAuth(`${API_URL}/payman/balance/${uid}`);
  if (!res.ok) return null;

  const data = await res.json();
  return data.balance || null;
};
