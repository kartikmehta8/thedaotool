import React, { useEffect, useState } from 'react';
import { Layout, Typography, Input, Button, Card, Form } from 'antd';
import {
  getOrganizationProfile,
  saveOrganizationProfile,
} from '../../api/organization/profile';

import {
  GitHubIntegration,
  DiscordIntegration,
} from '../../components/organization';
import toast from '../../utils/toast';

const { Content } = Layout;
const { Title } = Typography;

const OrganizationProfile = () => {
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [profile, setProfile] = useState({});
  const user = JSON.parse(localStorage.getItem('payman-user')) || {};
  const email = user.email || '';
  const uid = user.uid;

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
    <Layout style={{ minHeight: '100vh', backgroundColor: '#141414' }}>
      <Content
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          marginTop: 50,
          marginBottom: 50,
        }}
      >
        <Card
          style={{ width: 500, backgroundColor: '#1f1f1f', marginBottom: 20 }}
          loading={loading}
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
            <Form.Item name="description" label="Company Description">
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
            <Form.Item name="apiKey" label="Payman API Key">
              <Input placeholder="*****" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              Save
            </Button>
          </Form>
        </Card>
        <Card
          style={{ width: 500, backgroundColor: '#1f1f1f', marginBottom: 20 }}
          loading={loading}
        >
          <GitHubIntegration user={user} />
        </Card>
        <Card
          style={{ width: 500, backgroundColor: '#1f1f1f' }}
          loading={loading}
        >
          <DiscordIntegration user={user} />
        </Card>
      </Content>
    </Layout>
  );
};

export default OrganizationProfile;
