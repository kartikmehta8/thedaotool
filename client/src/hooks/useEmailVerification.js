import { useState } from 'react';
import { sendEmailVerification, verifyEmailToken } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import toast from '../utils/toast';

const useEmailVerification = (email) => {
  const { user, setUser } = useAuth();
  const [token, setToken] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleSendVerification = async () => {
    try {
      await sendEmailVerification(email);
      toast.success('Verification email sent');
      setOtpSent(true);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleVerifyToken = async () => {
    try {
      await verifyEmailToken(email, token);
      toast.success('Email verified');
      const updated = { ...user, emailVerified: true };
      localStorage.setItem('payman-user', JSON.stringify(updated));
      setUser(updated);
      setOtpSent(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return {
    token,
    setToken,
    otpSent,
    emailVerified: user?.emailVerified || false,
    handleSendVerification,
    handleVerifyToken,
  };
};

export default useEmailVerification;
