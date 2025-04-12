import { ref, onChildAdded, push, off } from 'firebase/database';
import { rtdb, db } from '../providers/firebase';
import {
  deleteDoc,
  doc,
  addDoc,
  collection,
  updateDoc,
  getDoc,
  setDoc,
  query,
  where,
  getDocs,
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

export const getContractsForBusiness = async (uid) => {
  try {
    const q = query(
      collection(db, 'contracts'),
      where('businessId', '==', uid)
    );
    const snapshot = await getDocs(q);

    const contracts = await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        let contractorInfo = null;

        if (data.contractorId) {
          const contractorRef = doc(db, 'contractors', data.contractorId);
          const contractorSnap = await getDoc(contractorRef);
          if (contractorSnap.exists()) {
            contractorInfo = {
              id: data.contractorId,
              ...contractorSnap.data(),
            };
          }
        }

        return {
          id: docSnap.id,
          ...data,
          contractorInfo,
        };
      })
    );

    return contracts;
  } catch (err) {
    toast.error('Error fetching contracts');
    return [];
  }
};

export const getBusinessProfile = async (uid) => {
  try {
    const ref = doc(db, 'businesses', uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      return snap.data();
    } else {
      return null; // Return null if no profile exists.
    }
  } catch (err) {
    toast.error('Failed to fetch profile');
    return null;
  }
};

export const saveBusinessProfile = async (uid, values, email) => {
  try {
    const profileData = {
      ...values,
      email,
    };

    await setDoc(doc(db, 'businesses', uid), profileData);
    toast.success('Profile updated successfully');
  } catch (err) {
    toast.error('Error saving profile');
  }
};
