import { API_URL } from '../../constants/constants';

export const applyToContract = async (contractId, userId) => {
  const res = await fetch(`${API_URL}/contractor/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contractId, userId }),
  });
  if (!res.ok) throw new Error('Failed to apply to contract');
  return true;
};

export const submitWork = async (contractId, submittedLink) => {
  const res = await fetch(`${API_URL}/contractor/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contractId, submittedLink }),
  });
  if (!res.ok) throw new Error('Failed to submit work');
  return true;
};

export const fetchContractsForContractor = async (uid) => {
  const res = await fetch(`${API_URL}/contractor/contracts/${uid}`);
  if (!res.ok) throw new Error('Failed to fetch contracts');
  const data = await res.json();
  return data.contracts || [];
};

export const unassignSelf = async (contractId) => {
  const res = await fetch(`${API_URL}/contractor/unassign`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contractId }),
  });
  if (!res.ok) throw new Error('Failed to unassign yourself');
  return true;
};
