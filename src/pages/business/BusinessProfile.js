import React, { useEffect, useState } from 'react';
import { Layout, Typography, Input, Button, Card, Form } from 'antd';
import { db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import toast from '../../utils/toast';

const { Content } = Layout;
const { Title } = Typography;

const BusinessProfile = () => {
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
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
    try {
      const ref = doc(db, 'businesses', uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        form.setFieldsValue({ ...defaultFields, ...data });
      } else {
        form.setFieldsValue(defaultFields); // prefill blank form.
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      await setDoc(doc(db, 'businesses', uid), {
        ...defaultFields,
        ...values,
        email,
      });
      toast.success('Profile updated');
    } catch (err) {
      console.error(err);
      toast.error('Error saving profile');
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
          marginTop: 50,
          marginBottom: 50,
        }}
      >
        <Card
          style={{ width: 500, backgroundColor: '#1f1f1f' }}
          loading={loading}
        >
          <Title level={3} style={{ color: '#fff', textAlign: 'center' }}>
            Business Profile
          </Title>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item name="companyName" label="Company Name">
              <Input placeholder="Example Inc." />
            </Form.Item>
            <Form.Item name="email" label="Email">
              <Input value={email} disabled style={{ color: '#ccc' }} />
            </Form.Item>
            <Form.Item name="description" label="Company Description">
              <Input.TextArea
                rows={4}
                placeholder="Tell us about your business..."
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
      </Content>
    </Layout>
  );
};

export default BusinessProfile;
