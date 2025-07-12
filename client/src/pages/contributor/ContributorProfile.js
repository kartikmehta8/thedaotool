import React, { useEffect, useState } from 'react';
import { Typography, Input, Button, Card, Form, Space, Tag } from 'antd';
import {
  fetchContributorProfile,
  saveContributorProfile,
} from '../../api/contributor/profile';
import { useAuth } from '../../context/AuthContext';
import useEmailVerification from '../../hooks/useEmailVerification';
import toast from '../../utils/toast';
import AppLayout from '../../components/AppLayout';
const { Title } = Typography;

const ContributorProfile = () => {
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const { user } = useAuth();
  const email = user.email;
  const uid = user.uid;
  const {
    token,
    setToken,
    otpSent,
    emailVerified,
    handleSendVerification,
    handleVerifyToken,
  } = useEmailVerification(email);

  const defaultFields = {
    name: '',
    roleTitle: '',
    skills: '',
    portfolio: '',
    linkedin: '',
    email: email,
    accountNumber: '',
    routingNumber: '',
    walletAddress: user.walletAddress,
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await fetchContributorProfile(uid);
        if (profile) {
          form.setFieldsValue({ ...defaultFields, ...profile });
        } else {
          form.setFieldsValue(defaultFields);
        }
      } catch (err) {
        form.setFieldsValue(defaultFields);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (values) => {
    try {
      await saveContributorProfile(uid, values, email, defaultFields);
      toast.success('Profile loaded successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to save contributor profile');
    }
  };

  return (
    <AppLayout
      contentProps={{
        style: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        },
      }}
    >
      <Card
        data-tour="profile-settings"
        className="form-card card-theme"
        style={{ width: 500, marginBottom: 20 }}
        loading={loading}
        bodyStyle={{ padding: '1rem' }}
      >
        <Title level={3} style={{ textAlign: 'center' }}>
          Contributor Profile
        </Title>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Full Name">
            <Input placeholder="John Doe" />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input value={email} disabled style={{ color: '#ccc' }} />
          </Form.Item>
          <Form.Item name="walletAddress" label="Wallet Address">
            <Input
              value={user.walletAddress}
              disabled
              style={{ color: '#ccc' }}
            />
          </Form.Item>
          {!emailVerified ? (
            <>
              <Space style={{ marginBottom: 10 }}>
                <Tag color="red">Email not verified</Tag>
                <Button size="small" onClick={handleSendVerification}>
                  Send Verification OTP
                </Button>
              </Space>
              {otpSent && (
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Input
                    placeholder="Enter OTP"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                  />
                  <Button block type="primary" onClick={handleVerifyToken}>
                    Verify Email
                  </Button>
                </Space>
              )}
            </>
          ) : (
            <Tag color="green" style={{ marginBottom: 10 }}>
              Email Verified
            </Tag>
          )}
          <Form.Item name="roleTitle" label="Your Role / Title">
            <Input placeholder="Frontend Engineer, Designer, etc." />
          </Form.Item>
          <Form.Item name="skills" label="Skills (comma separated)">
            <Input placeholder="React, Figma, Node.js" />
          </Form.Item>
          <Form.Item name="portfolio" label="Portfolio URL or GitHub">
            <Input placeholder="https://yourportfolio.com" />
          </Form.Item>
          <Form.Item name="linkedin" label="LinkedIn Profile">
            <Input placeholder="https://linkedin.com/in/yourprofile" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Save
          </Button>
        </Form>
      </Card>
    </AppLayout>
  );
};

export default ContributorProfile;
