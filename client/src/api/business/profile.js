import { API_URL } from '../../constants/constants';
import { fetchWithAuth } from '../../utils/fetchWithAuth';

export const getBusinessProfile = async (uid) => {
  const res = await fetchWithAuth(`${API_URL}/business/profile/${uid}`);
  if (!res.ok) return null; // TODO: handle error.
  const { profile } = await res.json();
  return profile;
};

export const saveBusinessProfile = async (uid, values, email) => {
  const res = await fetchWithAuth(`${API_URL}/business/profile/${uid}`, {
    method: 'PUT',
    body: JSON.stringify({ ...values, email }),
  });
  if (!res.ok) throw new Error('Error saving profile');
  return true;
};

export const getContractorData = async (contractorId) => {
  const res = await fetchWithAuth(
    `${API_URL}/business/contractor/${contractorId}`
  );
  if (!res.ok) throw new Error('Failed to fetch contractor');
  return await res.json();
};

export const updateContractorData = async (contractorId, data) => {
  const res = await fetchWithAuth(
    `${API_URL}/business/contractor/${contractorId}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    }
  );
  if (!res.ok) throw new Error('Failed to update contractor');
  return true;
};
