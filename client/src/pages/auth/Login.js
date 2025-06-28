import React, { useState } from 'react';
import { Button, Input, Typography, Card, Layout, Flex } from 'antd';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/auth';
import { saveUserToStorage } from '../../utils/localStorage';
import toast from '../../utils/toast';
import AuthHeader from '../../components/AuthHeader';

const { Title } = Typography;
const { Content } = Layout;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const user = await loginUser(email, password);
      await saveUserToStorage(user);
      navigate('/dashboard', { replace: true });
      navigate(0);
    } catch (err) {
      toast.error('Login failed');
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
            Log In
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
          <Button
            type="primary"
            block
            onClick={handleLogin}
            loading={loading}
            disabled={!email || !password}
          >
            Log In
          </Button>
          <Flex
            direction="column"
            justify="center"
            align="center"
            style={{ marginTop: 20 }}
          >
            <Button type="link" block onClick={() => navigate('/signup')}>
              Don't have an account?
            </Button>
            <Button
              type="link"
              block
              onClick={() => navigate('/forgot-password')}
            >
              Forgot Password?
            </Button>
          </Flex>
        </Card>
      </Content>
    </Layout>
  );
};

export default Login;
