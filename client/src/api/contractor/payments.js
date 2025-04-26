import { API_URL } from '../../constants/constants';

export const getContractorPayments = async (uid) => {
  const res = await fetch(`${API_URL}/contractor/payments/${uid}`);
  if (!res.ok) throw new Error('Failed to fetch contractor payments');
  const data = await res.json();
  return data.payments || [];
};
