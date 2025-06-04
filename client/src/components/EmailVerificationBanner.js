import React, { useState } from 'react';
import { Alert, Button } from 'antd';
import { sendEmailVerification } from '../api/auth';
import toast from '../utils/toast';

const EmailVerificationBanner = ({ email }) => {
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    try {
      setLoading(true);
      await sendEmailVerification(email);
      toast.success('Verification email sent');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Alert
      message="Email not verified"
      type="warning"
      showIcon
      description={
        <Button size="small" onClick={handleResend} loading={loading}>
          Resend link
        </Button>
      }
      style={{ marginBottom: '1rem' }}
    />
  );
};

export default EmailVerificationBanner;
