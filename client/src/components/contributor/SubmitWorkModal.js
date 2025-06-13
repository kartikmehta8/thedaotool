import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Input, Grid } from 'antd';
import { submitWork } from '../../api/contributor/bounties';
import toast from '../../utils/toast';
import { useAuth } from '../../context/AuthContext';

const SubmitWorkModal = ({ visible, bountyId, onCancel, onSubmitSuccess }) => {
  const [submission, setSubmission] = useState('');
  const { user } = useAuth();
  const emailVerified = user?.emailVerified || false;

  const handleSubmitWork = async () => {
    if (!emailVerified) {
      toast.warning('Please verify your email before submitting work');
      return;
    }
    try {
      await submitWork(bountyId, submission);
      onSubmitSuccess();
      onCancel();
      toast.success('Work submitted successfully');
      setSubmission('');
    } catch (err) {
      toast.error(err.message || 'Failed to submit work');
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

SubmitWorkModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  bountyId: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmitSuccess: PropTypes.func.isRequired,
};

export default SubmitWorkModal;
