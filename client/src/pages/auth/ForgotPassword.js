import React, { useState } from 'react';
import { Button, Input, Typography, Card, Layout } from 'antd';
import { useNavigate } from 'react-router-dom';
import toast from '../../utils/toast';
import {
  sendResetOTP,
  verifyResetTokenAndChangePassword,
} from '../../api/auth';

const { Title } = Typography;
const { Content } = Layout;

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    setLoading(true);
    try {
      await sendResetOTP(email);
      toast.success('OTP sent to your email');
      setStep(2);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      await verifyResetTokenAndChangePassword(email, token, newPassword);
      toast.success('Password reset successfully');
      navigate('/login');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Card
          style={{
            width: 400,
            marginTop: 100,
          }}
        >
          <Title level={3} style={{ textAlign: 'center' }}>
            Forgot Password
          </Title>

          {step === 1 ? (
            <>
              <Input
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ marginBottom: 10 }}
              />
              <Button
                type="primary"
                block
                onClick={handleSendOTP}
                loading={loading}
                disabled={!email}
              >
                Send OTP
              </Button>
            </>
          ) : (
            <>
              <Input
                placeholder="Enter OTP"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                style={{ marginBottom: 10 }}
              />
              <Input.Password
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ marginBottom: 10 }}
              />
              <Button
                type="primary"
                block
                onClick={handleResetPassword}
                loading={loading}
                disabled={!token || !newPassword}
              >
                Reset Password
              </Button>
            </>
          )}

          <Button
            type="link"
            block
            onClick={() => navigate('/login')}
            style={{ marginTop: 10 }}
          >
            Back to login
          </Button>
        </Card>
      </Content>
    </Layout>
  );
};

export default ForgotPassword;
