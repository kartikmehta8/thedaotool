import { USER_KEY, TOKEN_KEY } from '../constants/constants';

export const saveUserToStorage = ({ user, token }) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_KEY, token);
};

export const getUserFromStorage = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const getTokenFromStorage = () => {
  return localStorage.getItem(TOKEN_KEY) || null;
};

export const removeUserFromStorage = () => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
};
