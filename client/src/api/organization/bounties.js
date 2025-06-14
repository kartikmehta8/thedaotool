import { API_URL } from '../../constants/constants';
import { fetchWithAuth } from '../../utils/fetchWithAuth';

export const createBounty = async (values, userId) => {
  const res = await fetchWithAuth(`${API_URL}/organization/bounty`, {
    method: 'POST',
    body: JSON.stringify({ values, userId }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to create bounty');
  }
  return true;
};

export const deleteBounty = async (bountyId) => {
  const res = await fetchWithAuth(
    `${API_URL}/organization/bounty/${bountyId}`,
    {
      method: 'DELETE',
    }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to delete bounty');
  }
  return true;
};

export const updateBounty = async (bounty) => {
  const res = await fetchWithAuth(
    `${API_URL}/organization/bounty/${bounty.id}`,
    {
      method: 'PUT',
      body: JSON.stringify(bounty),
    }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Error saving bounty changes');
  }
  return true;
};

export const getBountysForOrganization = async (uid) => {
  const res = await fetchWithAuth(`${API_URL}/organization/bounties/${uid}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Error fetching bounties');
  }
  const data = await res.json();
  return data.bounties || [];
};

export const unassignContributor = async (bountyId) => {
  const res = await fetchWithAuth(
    `${API_URL}/organization/bounties/${bountyId}/unassign`,
    {
      method: 'PUT',
    }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to unassign contributor');
  }
  return true;
};

export const payBounty = async (bountyId) => {
  const res = await fetchWithAuth(
    `${API_URL}/organization/bounties/${bountyId}/pay`,
    { method: 'POST' }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to send payment');
  }
  const data = await res.json();
  return data.txHash;
};
