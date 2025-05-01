import React, { useEffect, useState } from 'react';
import { Layout, Typography, Input, Button, Card, Form } from 'antd';
import {
  fetchContractorProfile,
  saveContractorProfile,
} from '../../api/contractor/profile';
import { useAuth } from '../../context/AuthContext';
import toast from '../../utils/toast';

const { Content } = Layout;
const { Title } = Typography;

const ContractorProfile = () => {
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const { user } = useAuth();
  const email = user.email;
  const uid = user.uid;

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
        const profile = await fetchContractorProfile(uid);
        if (profile) {
          form.setFieldsValue({ ...defaultFields, ...profile });
        } else {
          form.setFieldsValue(defaultFields);
        }
      } catch (err) {
        console.error('Failed to fetch contractor profile.');
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
      await saveContractorProfile(uid, values, email, defaultFields);
      toast.success('Profile loaded successfully');
    } catch (err) {
      console.error('Failed to save contractor profile.');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#141414' }}>
      <Content
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 50,
          marginBottom: 50,
        }}
      >
        <Card
          style={{ width: 500, backgroundColor: '#1f1f1f' }}
          loading={loading}
        >
          <Title level={3} style={{ color: '#fff', textAlign: 'center' }}>
            Contractor Profile
          </Title>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item name="name" label="Full Name">
              <Input placeholder="John Doe" />
            </Form.Item>
            <Form.Item name="email" label="Email">
              <Input value={email} disabled style={{ color: '#ccc' }} />
            </Form.Item>
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
            <Form.Item name="accountNumber" label="Bank Account Number">
              <Input placeholder="1234567890" />
            </Form.Item>
            <Form.Item name="routingNumber" label="Bank Routing Number">
              <Input placeholder="1234567890" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              Save
            </Button>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

export default ContractorProfile;
