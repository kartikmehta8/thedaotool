import { ref, push, onChildAdded, off } from 'firebase/database';
import { rtdb, db } from '../providers/firebase';
import {
  doc,
  updateDoc,
  query,
  collection,
  getDocs,
  getDoc,
  where,
  setDoc,
} from 'firebase/firestore';
import toast from '../utils/toast';

export const subscribeToChat = (contractId, setMessages) => {
  if (!contractId) return;
  const chatRef = ref(rtdb, `chats/${contractId}`);

  // eslint-disable-next-line no-unused-vars
  const unsubscribe = onChildAdded(chatRef, (snapshot) => {
    setMessages((prev) => [...prev, snapshot.val()]);
  });

  return () => off(chatRef); // Clean up listener.
};

export const sendChatMessage = async (contractId, userId, senderName, text) => {
  if (!text.trim()) return;

  const msgRef = ref(rtdb, `chats/${contractId}`);
  await push(msgRef, {
    sender: userId,
    senderName: senderName || 'User',
    text: text.trim(),
    timestamp: Date.now(),
  });
};

export const applyToContract = async (contractId, userId, onRefetch) => {
  try {
    await updateDoc(doc(db, 'contracts', contractId), {
      status: 'assigned',
      contractorId: userId,
    });
    toast.success('Applied to contract');
    onRefetch();
  } catch (err) {
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
    await updateDoc(doc(db, 'contracts', contractId), {
      status: 'pending_payment',
      submittedLink: submission,
    });
    toast.success('Work submitted');
    onCancel();
    onSubmitSuccess();
  } catch (err) {
    toast.error('Failed to submit');
  }
};

export const fetchContractsForContractor = async (uid) => {
  try {
    const q = query(
      collection(db, 'contracts'),
      where('status', '!=', 'closed')
    );
    const snap = await getDocs(q);

    const allContracts = await Promise.all(
      snap.docs.map(async (docRef) => {
        const data = docRef.data();
        const businessSnap = await getDoc(
          doc(db, 'businesses', data.businessId)
        );

        return {
          id: docRef.id,
          ...data,
          businessInfo: businessSnap.exists() ? businessSnap.data() : {},
        };
      })
    );

    // Filter contracts: show if open or assigned to the current contractor.
    const filteredContracts = allContracts.filter(
      (c) => c.status === 'open' || c.contractorId === uid
    );
    return filteredContracts;
  } catch (err) {
    toast.error('Failed to fetch contracts');
    return [];
  }
};

export const fetchContractorProfile = async (uid, form, defaultFields) => {
  try {
    const ref = doc(db, 'contractors', uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      form.setFieldsValue({ ...defaultFields, ...data });
    } else {
      form.setFieldsValue(defaultFields); // initial empty values.
    }
  } catch (err) {
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
    await setDoc(doc(db, 'contractors', uid), {
      ...defaultFields,
      ...values,
      email,
    });
    toast.success('Profile updated');
  } catch (err) {
    toast.error('Error saving profile');
  }
};
