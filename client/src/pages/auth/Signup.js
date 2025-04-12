import React, { useState } from 'react';
import { Button, Input, Typography, Select, Card, Layout } from 'antd';
import { useNavigate } from 'react-router-dom';
import { signupUser } from '../../api/auth';

const { Title } = Typography;
const { Option } = Select;
const { Content } = Layout;

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('business');
  const navigate = useNavigate();

  const handleSignup = async () => {
    await signupUser(email, password, role, navigate);
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
            <Option value="business">Business</Option>
            <Option value="contractor">Contractor</Option>
          </Select>
          <Button type="primary" block onClick={handleSignup}>
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
