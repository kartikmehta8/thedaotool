import React, { useState } from 'react';
import { Button, Input, Typography, Select, Card, Layout } from 'antd';
import { useNavigate } from 'react-router-dom';
import { signupUser } from '../../api/auth';
import { saveUserToStorage } from '../../utils/localStorage';
import toast from '../../utils/toast';
import AuthHeader from '../../components/AuthHeader';

const { Title } = Typography;
const { Content } = Layout;

const roles = [
  { label: 'Organization', value: 'organization' },
  { label: 'Contributor', value: 'contributor' },
];

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('organization');
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
      navigate('/dashboard', { replace: true });
      navigate(0);
    } catch (err) {
      toast.error(err.message || 'Signup failed');
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
          className="form-card card-theme"
          style={{ marginTop: 100 }}
          bodyStyle={{ padding: '1rem' }}
        >
          <AuthHeader />
          <Title level={3} style={{ textAlign: 'center' }}>
            Sign Up
          </Title>
          <Input
            aria-label="Email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginBottom: 10 }}
          />
          <Input.Password
            aria-label="Password"
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
