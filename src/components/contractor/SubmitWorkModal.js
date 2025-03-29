import React, { useState } from 'react';
import { Modal, Input } from 'antd';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../providers/firebase';
import toast from '../../utils/toast';

const SubmitWorkModal = ({
  visible,
  contractId,
  onCancel,
  onSubmitSuccess,
}) => {
  const [submission, setSubmission] = useState('');

  const submitWork = async () => {
    try {
      await updateDoc(doc(db, 'contracts', contractId), {
        status: 'pending_payment',
        submittedLink: submission,
      });
      toast.success('Work submitted');
      onCancel();
      setSubmission('');
      onSubmitSuccess();
    } catch (err) {
      toast.error('Failed to submit');
    }
  };

  return (
    <Modal
      open={visible}
      title="Submit Work"
      onCancel={onCancel}
      onOk={submitWork}
      okText="Submit"
    >
      <Input
        placeholder="Enter delivery link (GitHub, site, etc.)"
        value={submission}
        onChange={(e) => setSubmission(e.target.value)}
      />
    </Modal>
  );
};

export default SubmitWorkModal;
