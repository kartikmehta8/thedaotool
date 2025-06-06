import { API_URL } from '../../constants/constants';
import { fetchWithAuth } from '../../utils/fetchWithAuth';

export const getContributorPayments = async (uid) => {
  const res = await fetchWithAuth(`${API_URL}/contributor/payments/${uid}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to fetch contributor payments');
  }
  const data = await res.json();
  return data.payments || [];
};
