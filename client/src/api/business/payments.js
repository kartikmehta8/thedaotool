import { API_URL } from '../../constants/constants';
import { fetchWithAuth } from '../../utils/fetchWithAuth';

export const getBusinessPayments = async (uid) => {
  const res = await fetchWithAuth(`${API_URL}/business/payments/${uid}`);
  if (!res.ok) throw new Error('Failed to fetch payment history');
  const data = await res.json();
  return data.payments || [];
};
