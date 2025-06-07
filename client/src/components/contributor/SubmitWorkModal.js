import React, { useState } from 'react';
import { Drawer, Input, Grid, Button } from 'antd';
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
    <Drawer
      open={visible}
      title="Submit Work"
      onClose={onCancel}
      placement="right"
      className="drawer-right"
      width={screens.xs ? '100%' : 500}
      bodyStyle={{ padding: 24 }}
    >
      <Input
        placeholder="Enter delivery link (GitHub, site, etc.)"
        value={submission}
        onChange={(e) => setSubmission(e.target.value)}
      />
      <Button
        type="primary"
        block
        style={{ marginTop: 8 }}
        onClick={handleSubmitWork}
      >
        Submit
      </Button>
    </Drawer>
  );
};

export default SubmitWorkModal;
