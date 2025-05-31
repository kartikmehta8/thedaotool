import { API_URL } from '../constants/constants';

export const loginUser = async (email, password) => {
  const res = await fetch(API_URL + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Login failed');
  }

  return { user: data.user, token: data.token };
};

export const signupUser = async (email, password, role) => {
  const res = await fetch(API_URL + '/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Signup failed');
  }

  return { user: data.user, token: data.token };
};

export const sendResetOTP = async (email) => {
  const res = await fetch(API_URL + '/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to send OTP');
  }

  return true;
};

export const verifyResetTokenAndChangePassword = async (
  email,
  token,
  newPassword
) => {
  const res = await fetch(API_URL + '/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, token, newPassword }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to reset password');
  }

  return true;
};

export const sendEmailVerification = async (email) => {
  const res = await fetch(`${API_URL}/auth/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to send verification email');
  }

  return true;
};

export const verifyEmailToken = async (email, token) => {
  const res = await fetch(`${API_URL}/auth/verify-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, token }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Token verification failed');
  }

  return true;
};
