import { ref, onChildAdded, push, off } from 'firebase/database';
import { rtdb, db } from '../providers/firebase';
import {
  deleteDoc,
  doc,
  addDoc,
  collection,
  updateDoc,
  getDoc,
} from 'firebase/firestore';
import toast from '../utils/toast';

export const listenToMessages = (contractId, setMessages) => {
  const chatRef = ref(rtdb, `chats/${contractId}`);
  // eslint-disable-next-line no-unused-vars
  const unsubscribe = onChildAdded(chatRef, (snapshot) => {
    const msg = snapshot.val();
    setMessages((prev) => [...prev, msg]);
  });

  return () => {
    off(chatRef);
  };
};

export const sendMessage = async (contractId, userId, senderName, text) => {
  if (!text.trim()) return;

  const chatRef = ref(rtdb, `chats/${contractId}`);
  await push(chatRef, {
    senderId: userId,
    senderName,
    text: text.trim(),
    timestamp: new Date().toISOString(),
  });
};

export const deleteContract = async (contractId, onRefetch) => {
  try {
    await deleteDoc(doc(db, 'contracts', contractId));
    toast.success('Contract deleted successfully');
    onRefetch(); // Refresh contract list after deletion.
  } catch (err) {
    toast.error('Failed to delete contract');
  }
};

export const createContract = async (values, userId, onCreateSuccess) => {
  try {
    const newContract = {
      name: values.name || '',
      description: values.description || '',
      deadline: values.deadline?.format('YYYY-MM-DD') || '',
      amount: Number(values.amount || 0),
      businessId: userId,
      contractorId: null,
      status: 'open',
      submittedLink: '',
      createdAt: new Date().toISOString(),
      tags: values.tags ? values.tags.split(',') : [],
    };

    await addDoc(collection(db, 'contracts'), newContract);
    toast.success('Contract created successfully');
    onCreateSuccess(); // Callback after successful contract creation.
  } catch (err) {
    toast.error('Failed to create contract');
  }
};

export const updateContract = async (contract, onUpdateSuccess, onCancel) => {
  try {
    await updateDoc(doc(db, 'contracts', contract.id), contract);
    toast.success('Contract updated successfully');
    onCancel();
    onUpdateSuccess();
  } catch (err) {
    toast.error('Error saving contract changes');
  }
};

export const getContractorData = async (contractorId) => {
  const contractorRef = doc(db, 'contractors', contractorId);
  const contractorSnap = await getDoc(contractorRef);
  if (contractorSnap.exists()) {
    return contractorSnap.data();
  } else {
    throw new Error('Contractor not found');
  }
};

export const updateContractorData = async (contractorId, data) => {
  const contractorRef = doc(db, 'contractors', contractorId);
  await updateDoc(contractorRef, data);
};
