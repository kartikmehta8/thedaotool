import { ref, push, onChildAdded, off } from 'firebase/database';
import { rtdb, db } from '../providers/firebase';
import { doc, updateDoc } from 'firebase/firestore';
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
