import { API_URL } from '../../constants/constants';

export const getBusinessPayments = async (uid) => {
  const res = await fetch(`${API_URL}/business/payments/${uid}`);
  if (!res.ok) throw new Error('Failed to fetch payment history');
  const data = await res.json();
  return data.payments || [];
};
