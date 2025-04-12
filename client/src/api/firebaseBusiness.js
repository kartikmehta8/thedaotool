import toast from '../utils/toast';
import { API_URL } from '../constants/constants';

import { io } from 'socket.io-client';

let socket;

const initSocket = () => {
  if (!socket) {
    socket = io(process.env.REACT_APP_BACKEND_URL);
  }
  return socket;
};

export const listenToMessages = (contractId, setMessages) => {
  const socket = initSocket();
  socket.emit('join-contract', contractId);

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
  };
};

export const sendMessage = async (contractId, userId, senderName, text) => {
  if (!text.trim()) return;

  const s = initSocket();
  s.emit('send-message', {
    contractId,
    senderId: userId,
    senderName,
    text: text.trim(),
  });
};

export const createContract = async (values, userId, onCreateSuccess) => {
  try {
    const res = await fetch(`${API_URL}/business/contract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ values, userId }),
    });
    if (!res.ok) throw new Error();
    toast.success('Contract created successfully');
    onCreateSuccess();
  } catch {
    toast.error('Failed to create contract');
  }
};

export const deleteContract = async (contractId, onRefetch) => {
  try {
    const res = await fetch(`${API_URL}/business/contract/${contractId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error();
    toast.success('Contract deleted successfully');
    onRefetch();
  } catch {
    toast.error('Failed to delete contract');
  }
};

export const updateContract = async (contract, onUpdateSuccess, onCancel) => {
  try {
    const res = await fetch(`${API_URL}/business/contract/${contract.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contract),
    });
    if (!res.ok) throw new Error();
    toast.success('Contract updated successfully');
    onCancel();
    onUpdateSuccess();
  } catch {
    toast.error('Error saving contract changes');
  }
};

export const getContractsForBusiness = async (uid) => {
  try {
    const res = await fetch(`${API_URL}/business/contracts/${uid}`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.contracts;
  } catch {
    toast.error('Error fetching contracts');
    return [];
  }
};

export const getContractorData = async (contractorId) => {
  try {
    const res = await fetch(`${API_URL}/business/contractor/${contractorId}`);
    if (!res.ok) throw new Error();
    return res.json();
  } catch {
    toast.error('Failed to fetch contractor');
    return null;
  }
};

export const updateContractorData = async (contractorId, data) => {
  try {
    const res = await fetch(`${API_URL}/business/contractor/${contractorId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error();
  } catch {
    toast.error('Failed to update contractor');
  }
};

export const getBusinessProfile = async (uid) => {
  try {
    const res = await fetch(`${API_URL}/business/profile/${uid}`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    toast.error('Failed to fetch profile');
    return null;
  }
};

export const saveBusinessProfile = async (uid, values, email) => {
  try {
    const res = await fetch(`${API_URL}/business/profile/${uid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...values, email }),
    });
    if (!res.ok) throw new Error();
    toast.success('Profile updated successfully');
  } catch {
    toast.error('Error saving profile');
  }
};
