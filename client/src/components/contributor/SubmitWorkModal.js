import React, { useState } from 'react';
import { Modal, Input, Grid } from 'antd';
import { submitWork } from '../../api/contributor/bounties';
import toast from '../../utils/toast';

const SubmitWorkModal = ({ visible, bountyId, onCancel, onSubmitSuccess }) => {
  const [submission, setSubmission] = useState('');

  const handleSubmitWork = async () => {
    try {
      await submitWork(bountyId, submission);
      onSubmitSuccess();
      onCancel();
      toast.success('Work submitted successfully');
      setSubmission('');
    } catch (err) {
      toast.error('Failed to submit work');
    }
  };

  const screens = Grid.useBreakpoint();

  return (
    <Modal
      open={visible}
      title="Submit Work"
      onCancel={onCancel}
      onOk={handleSubmitWork}
      okText="Submit"
      width={screens.xs ? '100%' : 500}
      bodyStyle={{ maxHeight: '60vh', overflowY: 'auto' }}
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
