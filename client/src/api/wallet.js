import { API_URL } from '../constants/constants';
import { fetchWithAuth } from '../utils/fetchWithAuth';

export const getBalance = async () => {
  const res = await fetchWithAuth(`${API_URL}/wallet/balance`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to fetch balance');
  }
  const data = await res.json();
  return data.balance;
};

export const sendFunds = async (toAddress, amount) => {
  const res = await fetchWithAuth(`${API_URL}/wallet/send`, {
    method: 'POST',
    body: JSON.stringify({ toAddress, amount }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to send funds');
  }
  const data = await res.json();
  return data.txHash;
};

export const getPortfolio = async () => {
  const res = await fetchWithAuth(`${API_URL}/wallet/portfolio`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to fetch portfolio');
  }
  const data = await res.json();
  return data.assets;
};
