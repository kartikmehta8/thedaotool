import React, { useState } from 'react';
import { Button, Input, Typography, Select, Card, Layout } from 'antd';
import { useNavigate } from 'react-router-dom';
import { signupUser } from '../../api/auth';
import { saveUserToStorage } from '../../utils/localStorage';
import toast from '../../utils/toast';

const { Title } = Typography;
const { Content } = Layout;

const roles = [
  { label: 'Business', value: 'business' },
  { label: 'Contractor', value: 'contractor' },
];

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('business');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    setLoading(true);
    try {
      const user = await signupUser(email, password, role);
      if (!user) {
        throw new Error('Invalid user data');
      }
      saveUserToStorage(user);
      toast.success('Account created successfully!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Signup error:', err);
      toast.error(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#141414' }}>
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
            backgroundColor: '#1f1f1f',
            color: '#fff',
            marginTop: 100,
          }}
        >
          <Title level={3} style={{ color: '#fff', textAlign: 'center' }}>
            Sign Up
          </Title>
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginBottom: 10 }}
          />
          <Input.Password
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginBottom: 10 }}
          />
          <Select
            value={role}
            onChange={(val) => setRole(val)}
            style={{ width: '100%', marginBottom: 10 }}
          >
            {roles.map((r) => (
              <Select.Option key={r.value} value={r.value}>
                {r.label}
              </Select.Option>
            ))}
          </Select>
          <Button
            type="primary"
            block
            onClick={handleSignup}
            loading={loading}
            disabled={!email || !password}
          >
            Sign Up
          </Button>

          <Button
            type="link"
            block
            onClick={() => navigate('/login')}
            style={{ marginTop: 10 }}
          >
            Already have an account?
          </Button>
        </Card>
      </Content>
    </Layout>
  );
};

export default Signup;
