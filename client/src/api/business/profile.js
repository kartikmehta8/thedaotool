import { API_URL } from '../../constants/constants';

export const getBusinessProfile = async (uid) => {
  const res = await fetch(`${API_URL}/business/profile/${uid}`);
  if (!res.ok) throw new Error('Failed to fetch profile');
  const { profile } = await res.json();
  return profile;
};

export const saveBusinessProfile = async (uid, values, email) => {
  const res = await fetch(`${API_URL}/business/profile/${uid}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...values, email }),
  });
  if (!res.ok) throw new Error('Error saving profile');
  return true;
};

export const getContractorData = async (contractorId) => {
  const res = await fetch(`${API_URL}/business/contractor/${contractorId}`);
  if (!res.ok) throw new Error('Failed to fetch contractor');
  return await res.json();
};

export const updateContractorData = async (contractorId, data) => {
  const res = await fetch(`${API_URL}/business/contractor/${contractorId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update contractor');
  return true;
};
