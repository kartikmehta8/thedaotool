import React from 'react';
import { Alert } from 'antd';

const EmailVerificationBanner = ({ email }) => {
  return (
    <Alert
      type="warning"
      showIcon
      description={
        <>
          Please verify your email address <strong>{email}</strong> to access
          all features.
        </>
      }
      style={{ marginBottom: '1rem' }}
    />
  );
};

export default EmailVerificationBanner;
