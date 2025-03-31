import React, { useState } from 'react';
import { Modal, Input } from 'antd';
import { submitWork } from '../../api/firebaseContractor';

const SubmitWorkModal = ({
  visible,
  contractId,
  onCancel,
  onSubmitSuccess,
}) => {
  const [submission, setSubmission] = useState('');

  const handleSubmitWork = async () => {
    await submitWork(contractId, submission, onCancel, onSubmitSuccess);
    setSubmission(''); // Clear the input after submission.
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
