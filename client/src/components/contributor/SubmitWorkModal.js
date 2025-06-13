import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Input, Grid } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
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
    <AnimatePresence>
      {visible && (
        <Modal
          open
          title="Submit Work"
          onCancel={onCancel}
          onOk={handleSubmitWork}
          okText="Submit"
          width={screens.xs ? '100%' : 500}
          bodyStyle={{ flex: 1, overflowY: 'auto' }}
          wrapClassName="modal-right"
          modalRender={(modal) => (
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              {modal}
            </motion.div>
          )}
        >
          <Input
            placeholder="Enter delivery link (GitHub, site, etc.)"
            value={submission}
            onChange={(e) => setSubmission(e.target.value)}
          />
        </Modal>
      )}
    </AnimatePresence>
  );
};

SubmitWorkModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  bountyId: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmitSuccess: PropTypes.func.isRequired,
};

export default SubmitWorkModal;
