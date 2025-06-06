import { API_URL } from '../../constants/constants';
import { fetchWithAuth } from '../../utils/fetchWithAuth';

export const getOrganizationProfile = async (uid) => {
  const res = await fetchWithAuth(`${API_URL}/organization/profile/${uid}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to fetch profile');
  }
  const { profile } = await res.json();
  return profile;
};

export const saveOrganizationProfile = async (uid, values, email) => {
  const res = await fetchWithAuth(`${API_URL}/organization/profile/${uid}`, {
    method: 'PUT',
    body: JSON.stringify({ ...values, email }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Error saving profile');
  }
  return true;
};

export const getContributorData = async (contributorId) => {
  const res = await fetchWithAuth(
    `${API_URL}/organization/contributor/${contributorId}`
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to fetch contributor');
  }
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
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to update contributor');
  }
  return true;
};

export const getOrganizationAnalytics = async (uid) => {
  const res = await fetchWithAuth(`${API_URL}/organization/analytics/${uid}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to fetch analytics');
  }
  const data = await res.json();
  return data.analytics || {};
};
