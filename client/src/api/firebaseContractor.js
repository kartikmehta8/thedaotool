import { API_URL } from '../constants/constants';
import toast from '../utils/toast';

import { io } from 'socket.io-client';

let socket;

const initSocket = () => {
  if (!socket) {
    socket = io(process.env.REACT_APP_BACKEND_URL);
  }
  return socket;
};

export const subscribeToChat = (contractId, setMessages) => {
  const s = initSocket();
  s.emit('join-contract', contractId);

  const handleNew = (msg) => {
    setMessages((prev) => [...prev, msg]);
  };

  const handleHistory = (history) => {
    setMessages(history);
  };

  socket.on('chat-history', handleHistory);
  socket.on('new-message', handleNew);

  return () => {
    socket.off('chat-history', handleHistory);
    socket.off('new-message', handleNew);
    // socket.disconnect(); socket = null;
  };
};

export const sendChatMessage = async (contractId, userId, senderName, text) => {
  if (!text.trim()) return;

  const s = initSocket();
  s.emit('send-message', {
    contractId,
    senderId: userId,
    senderName,
    text: text.trim(),
  });
};

export const applyToContract = async (contractId, userId, onRefetch) => {
  try {
    const res = await fetch(`${API_URL}/contractor/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contractId, userId }),
    });
    if (!res.ok) throw new Error();
    toast.success('Applied to contract');
    onRefetch();
  } catch {
    toast.error('Application failed');
  }
};

export const submitWork = async (
  contractId,
  submission,
  onCancel,
  onSubmitSuccess
) => {
  try {
    const res = await fetch(`${API_URL}/contractor/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contractId, submittedLink: submission }),
    });
    if (!res.ok) throw new Error();
    toast.success('Work submitted');
    onCancel();
    onSubmitSuccess();
  } catch {
    toast.error('Failed to submit');
  }
};

export const fetchContractsForContractor = async (uid) => {
  try {
    const res = await fetch(`${API_URL}/contractor/contracts/${uid}`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.contracts;
  } catch {
    toast.error('Failed to fetch contracts');
    return [];
  }
};

export const fetchContractorProfile = async (uid, form, defaultFields) => {
  try {
    const res = await fetch(`${API_URL}/contractor/profile/${uid}`);
    if (res.status === 404) return form.setFieldsValue(defaultFields);
    if (!res.ok) throw new Error();
    const data = await res.json();
    form.setFieldsValue({ ...defaultFields, ...data });
  } catch {
    toast.error('Failed to fetch profile');
  }
};

export const saveContractorProfile = async (
  uid,
  values,
  email,
  defaultFields
) => {
  try {
    const res = await fetch(`${API_URL}/contractor/profile/${uid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...defaultFields, ...values, email }),
    });
    if (!res.ok) throw new Error();
    toast.success('Profile updated');
  } catch {
    toast.error('Error saving profile');
  }
};
