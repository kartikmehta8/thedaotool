import React, { useEffect, useState } from 'react';
import {
  Layout,
  Typography,
  Input,
  Button,
  Card,
  Form,
  Space,
  Tag,
} from 'antd';
import {
  getOrganizationProfile,
  saveOrganizationProfile,
} from '../../api/organization/profile';
import {
  GitHubIntegration,
  DiscordIntegration,
  // PaymanIntegration,
} from '../../components/organization';
import toast from '../../utils/toast';
import { sendEmailVerification, verifyEmailToken } from '../../api/auth';

const { Content } = Layout;
const { Title, Text } = Typography;

const OrganizationProfile = () => {
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [profile, setProfile] = useState({});
  const [token, setToken] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const user = JSON.parse(localStorage.getItem('payman-user')) || {};
  const email = user.email || '';
  const uid = user.uid;
  const emailVerified = user.emailVerified || false;

  const defaultFields = {
    companyName: '',
    description: '',
    industry: '',
    website: '',
    email: email,
    apiKey: '',
  };

  const fetchProfile = async () => {
    setLoading(true);
    const profileData = await getOrganizationProfile(uid);
    if (profileData) {
      setProfile(profileData);
      form.setFieldsValue({ ...defaultFields, ...profileData });
    } else {
      form.setFieldsValue(defaultFields);
    }
    setLoading(false);
  };

  const handleSubmit = async (values) => {
    try {
      await saveOrganizationProfile(
        uid,
        {
          ...profile,
          ...values,
        },
        email
      );
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

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
      user.emailVerified = true;
      localStorage.setItem('payman-user', JSON.stringify(user));
      setOtpSent(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#141414' }}>
      <Content
        className="page-container"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Card
          className="form-card"
          style={{ backgroundColor: '#1f1f1f', marginBottom: 20 }}
          loading={loading}
          bodyStyle={{ padding: '1rem' }}
        >
          <Title level={3} style={{ color: '#fff', textAlign: 'center' }}>
            Organization Profile
          </Title>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="companyName"
              label="Company Name"
              rules={[
                { required: true, message: 'Please enter your company name' },
              ]}
            >
              <Input placeholder="Example Inc." />
            </Form.Item>
            <Form.Item name="email" label="Email">
              <Input value={email} disabled style={{ color: '#ccc' }} />
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
            <Form.Item
              name="description"
              label={<Text style={{ color: '#ddd' }}>Company Description</Text>}
            >
              <Input.TextArea
                rows={4}
                placeholder="Tell us about your organization..."
              />
            </Form.Item>
            <Form.Item name="industry" label="Industry">
              <Input placeholder="Tech / Finance / Healthcare etc." />
            </Form.Item>
            <Form.Item name="website" label="Website URL">
              <Input placeholder="https://yourcompany.com" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              Save
            </Button>
          </Form>
        </Card>
        <Card
          className="form-card"
          style={{ backgroundColor: '#1f1f1f', marginBottom: 20 }}
          loading={loading}
          bodyStyle={{ padding: '1rem' }}
        >
          {/* <PaymanIntegration user={user} /> */}
        </Card>
        <Card
          style={{ width: 500, backgroundColor: '#1f1f1f', marginBottom: 20 }}
          loading={loading}
        >
          <GitHubIntegration user={user} />
        </Card>
        <Card
          className="form-card"
          style={{ backgroundColor: '#1f1f1f' }}
          loading={loading}
          bodyStyle={{ padding: '1rem' }}
        >
          <DiscordIntegration user={user} />
        </Card>
      </Content>
    </Layout>
  );
};

export default OrganizationProfile;
