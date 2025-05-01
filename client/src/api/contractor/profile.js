import { API_URL } from '../../constants/constants';
import { fetchWithAuth } from '../../utils/fetchWithAuth';

export const fetchContractorProfile = async (uid) => {
  const res = await fetchWithAuth(`${API_URL}/contractor/profile/${uid}`);
  if (!res.ok) throw new Error('Failed to fetch contractor profile');
  const { profile } = await res.json();
  return profile;
};

export const getContractorProfile = async (uid) => {
  const res = await fetchWithAuth(`${API_URL}/contractor/profile/${uid}`);
  if (!res.ok) return null;
  return await res.json();
};

export const saveContractorProfile = async (
  uid,
  values,
  email,
  defaultFields = {}
) => {
  const bodyData = { ...defaultFields, ...values, email };

  const res = await fetchWithAuth(`${API_URL}/contractor/profile/${uid}`, {
    method: 'PUT',
    body: JSON.stringify(bodyData),
  });
  if (!res.ok) throw new Error('Failed to save contractor profile');
  return true;
};
