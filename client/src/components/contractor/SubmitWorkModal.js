import React, { useState } from 'react';
import { Modal, Input } from 'antd';
import { submitWork } from '../../api/contractor/contracts';

const SubmitWorkModal = ({
  visible,
  contractId,
  onCancel,
  onSubmitSuccess,
}) => {
  const [submission, setSubmission] = useState('');

  const handleSubmitWork = async () => {
    try {
      await submitWork(contractId, submission);
      onSubmitSuccess();
      onCancel();
      setSubmission('');
    } catch (err) {
      console.error('Failed to submit work', err);
    }
  };

  return (
    <Modal
      open={visible}
      title="Submit Work"
      onCancel={onCancel}
      onOk={handleSubmitWork}
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
