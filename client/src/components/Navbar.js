import React from 'react';
import { Layout, Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate();
  const localUser = JSON.parse(localStorage.getItem('payman-user'));
  const role = localUser?.role;

  const handleLogout = () => {
    localStorage.removeItem('payman-user');
    navigate('/login');
  };

  const handleProfile = () => {
    if (role === 'organization') {
      navigate('/profile/organization');
    } else {
      navigate('/profile/contributor');
    }
  };

  return (
    <Header
      style={{
        backgroundColor: '#1f1f1f',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>
        DAO{' '}
        <span style={{ fontWeight: 'normal', fontSize: '14px', color: '#aaa' }}>
          [{role}]
        </span>
      </div>
      <Space>
        <Button type="default" onClick={() => navigate('/payment-history')}>
          Payments
        </Button>
        <Button type="default" onClick={handleProfile}>
          Profile
        </Button>
        <Button type="primary" onClick={handleLogout}>
          Logout
        </Button>
      </Space>
    </Header>
  );
};

export default Navbar;
