import { API_URL } from '../../constants/constants';
import { fetchWithAuth } from '../../utils/fetchWithAuth';

export const fetchContributorProfile = async (uid) => {
  const res = await fetchWithAuth(`${API_URL}/contributor/profile/${uid}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to fetch contributor profile');
  }
  const { profile } = await res.json();
  return profile;
};

export const getContributorProfile = async (uid) => {
  const res = await fetchWithAuth(`${API_URL}/contributor/profile/${uid}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to fetch contributor profile');
  }
  return await res.json();
};

export const saveContributorProfile = async (
  uid,
  values,
  email,
  defaultFields = {}
) => {
  const bodyData = { ...defaultFields, ...values, email };

  const res = await fetchWithAuth(`${API_URL}/contributor/profile/${uid}`, {
    method: 'PUT',
    body: JSON.stringify(bodyData),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to save contributor profile');
  }
  return true;
};

export const getContributorAnalytics = async (uid) => {
  const res = await fetchWithAuth(`${API_URL}/contributor/analytics/${uid}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to fetch analytics');
  }
  const data = await res.json();
  return data.analytics || {};
};
