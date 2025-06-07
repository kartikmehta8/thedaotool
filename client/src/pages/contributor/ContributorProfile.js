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
import { UserOutlined, CreditCardOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Navbar } from '../../components';
import {
  fetchContributorProfile,
  saveContributorProfile,
} from '../../api/contributor/profile';
import { useAuth } from '../../context/AuthContext';
import useEmailVerification from '../../hooks/useEmailVerification';
import toast from '../../utils/toast';

const { Content, Sider } = Layout;
const { Title } = Typography;

const ContributorProfile = () => {
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [section, setSection] = useState('basic');
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
      toast.error('Failed to save contributor profile');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />
      <Layout>
        <Sider breakpoint="lg" collapsedWidth="0" width={200}>
          <Menu
            mode="inline"
            selectedKeys={[section]}
            onClick={(e) => setSection(e.key)}
            items={[
              { key: 'basic', icon: <UserOutlined />, label: 'Basic Info' },
              {
                key: 'payment',
                icon: <CreditCardOutlined />,
                label: 'Payments',
              },
            ]}
          />
        </Sider>
        <Content className="page-container" style={{ padding: '2rem' }}>
          <Title
            level={3}
            style={{ textAlign: 'center', marginBottom: '1rem' }}
          >
            Contributor Profile
          </Title>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              hidden={section !== 'basic'}
            >
              <Card
                className="section-card"
                title="Basic Information"
                loading={loading}
              >
                <Form.Item name="name" label="Full Name">
                  <Input placeholder="John Doe" />
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
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              hidden={section !== 'payment'}
            >
              <Card
                className="section-card"
                title="Payment Details"
                loading={loading}
              >
                <Form.Item name="accountNumber" label="Bank Account Number">
                  <Input placeholder="1234567890" />
                </Form.Item>
                <Form.Item name="routingNumber" label="Bank Routing Number">
                  <Input placeholder="1234567890" />
                </Form.Item>
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

export default ContributorProfile;
