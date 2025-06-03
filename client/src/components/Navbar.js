import React, { useState } from 'react';
import { Layout, Button, Space, Drawer, Grid } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate();
  const localUser = JSON.parse(localStorage.getItem('payman-user'));
  const role = localUser?.role;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const screens = Grid.useBreakpoint();

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
      {screens.md ? (
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
      ) : (
        <Button
          type="text"
          icon={<MenuOutlined style={{ color: '#fff' }} />}
          onClick={() => setDrawerOpen(true)}
        />
      )}
      <Drawer
        placement="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ padding: '1rem' }}>
          <Button
            type="default"
            block
            style={{ marginBottom: 8 }}
            onClick={() => {
              navigate('/payment-history');
              setDrawerOpen(false);
            }}
          >
            Payments
          </Button>
          <Button
            type="default"
            block
            style={{ marginBottom: 8 }}
            onClick={() => {
              handleProfile();
              setDrawerOpen(false);
            }}
          >
            Profile
          </Button>
          <Button type="primary" block onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Drawer>
    </Header>
  );
};

export default Navbar;
