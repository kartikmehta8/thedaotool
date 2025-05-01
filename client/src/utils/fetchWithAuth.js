import { getTokenFromStorage } from './localStorage';

export const fetchWithAuth = async (url, options = {}) => {
  const token = getTokenFromStorage();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  return fetch(url, { ...options, headers });
};
