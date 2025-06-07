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
  Menu,
} from 'antd';
import { UserOutlined, ApiOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Navbar } from '../../components';
import {
  getOrganizationProfile,
  saveOrganizationProfile,
} from '../../api/organization/profile';
import {
  GitHubIntegration,
  DiscordIntegration,
} from '../../components/organization';
import toast from '../../utils/toast';
import { useAuth } from '../../context/AuthContext';
import useEmailVerification from '../../hooks/useEmailVerification';

const { Content, Sider } = Layout;
const { Title, Text } = Typography;

const OrganizationProfile = () => {
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [profile, setProfile] = useState({});
  const [section, setSection] = useState('info');
  const { user } = useAuth();
  const email = user.email || '';
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

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />
      <Layout>
        <Sider breakpoint="lg" collapsedWidth="0" width={220}>
          <Menu
            mode="inline"
            selectedKeys={[section]}
            onClick={(e) => setSection(e.key)}
            items={[
              { key: 'info', icon: <UserOutlined />, label: 'Profile Info' },
              {
                key: 'integrations',
                icon: <ApiOutlined />,
                label: 'Integrations',
              },
            ]}
          />
        </Sider>
        <Content
          className="page-container"
          style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}
        >
          <Title
            level={3}
            style={{ textAlign: 'center', marginBottom: '1rem' }}
          >
            Organization Profile
          </Title>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              hidden={section !== 'info'}
            >
              <Card
                className="section-card"
                title="Organization Info"
                loading={loading}
              >
                <Form.Item
                  name="companyName"
                  label="Company Name"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter your company name',
                    },
                  ]}
                >
                  <Input placeholder="Example Inc." />
                </Form.Item>
                <Form.Item name="email" label="Email">
                  <Input value={email} disabled />
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
                        <Button
                          block
                          type="primary"
                          onClick={handleVerifyToken}
                        >
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
                  label={<Text>Company Description</Text>}
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
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              hidden={section !== 'integrations'}
            >
              <Card
                className="section-card"
                title="GitHub Integration"
                loading={loading}
              >
                <GitHubIntegration
                  uid={uid}
                  profile={profile}
                  setProfile={setProfile}
                />
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              hidden={section !== 'integrations'}
            >
              <Card
                className="section-card"
                title="Discord Integration"
                loading={loading}
              >
                <DiscordIntegration
                  uid={uid}
                  profile={profile}
                  setProfile={setProfile}
                />
              </Card>
            </motion.div>

            <Button type="primary" htmlType="submit" block>
              Save
            </Button>
          </Form>
        </Content>
      </Layout>
    </Layout>
  );
};

export default OrganizationProfile;
