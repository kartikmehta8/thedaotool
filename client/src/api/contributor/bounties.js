import { API_URL } from '../../constants/constants';
import { fetchWithAuth } from '../../utils/fetchWithAuth';

export const applyToBounty = async (bountyId, userId) => {
  const res = await fetchWithAuth(`${API_URL}/contributor/apply`, {
    method: 'POST',
    body: JSON.stringify({ bountyId, userId }),
  });
  if (!res.ok) throw new Error('Failed to apply to bounty');
  return true;
};

export const submitWork = async (bountyId, submittedLink) => {
  const res = await fetchWithAuth(`${API_URL}/contributor/submit`, {
    method: 'POST',
    body: JSON.stringify({ bountyId, submittedLink }),
  });
  if (!res.ok) throw new Error('Failed to submit work');
  return true;
};

export const fetchBountysForContributor = async (uid) => {
  const res = await fetchWithAuth(`${API_URL}/contributor/bounties/${uid}`);
  if (!res.ok) throw new Error('Failed to fetch bounties');
  const data = await res.json();
  return data.bounties || [];
};

export const unassignSelf = async (bountyId) => {
  const res = await fetchWithAuth(`${API_URL}/contributor/unassign`, {
    method: 'PUT',
    body: JSON.stringify({ bountyId }),
  });
  if (!res.ok) throw new Error('Failed to unassign yourself');
  return true;
};
