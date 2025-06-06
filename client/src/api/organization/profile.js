import { API_URL } from '../../constants/constants';
import { fetchWithAuth } from '../../utils/fetchWithAuth';

export const getOrganizationProfile = async (uid) => {
  const res = await fetchWithAuth(`${API_URL}/organization/profile/${uid}`);
  if (!res.ok) return null; // TODO: handle error.
  const { profile } = await res.json();
  return profile;
};

export const saveOrganizationProfile = async (uid, values, email) => {
  const res = await fetchWithAuth(`${API_URL}/organization/profile/${uid}`, {
    method: 'PUT',
    body: JSON.stringify({ ...values, email }),
  });
  if (!res.ok) throw new Error('Error saving profile');
  return true;
};

export const getContributorData = async (contributorId) => {
  const res = await fetchWithAuth(
    `${API_URL}/organization/contributor/${contributorId}`
  );
  if (!res.ok) throw new Error('Failed to fetch contributor');
  return await res.json();
};

export const updateContributorData = async (contributorId, data) => {
  const res = await fetchWithAuth(
    `${API_URL}/organization/contributor/${contributorId}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    }
  );
  if (!res.ok) throw new Error('Failed to update contributor');
  return true;
};

export const getOrganizationAnalytics = async (uid) => {
  const res = await fetchWithAuth(`${API_URL}/organization/analytics/${uid}`);
  if (!res.ok) throw new Error('Failed to fetch analytics');
  const data = await res.json();
  return data.analytics || {};
};
