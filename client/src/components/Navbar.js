import React, { useState } from 'react';
import { Layout, Button, Space, Drawer, Grid, Switch } from 'antd';
import { MenuOutlined, BulbOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const role = user?.role;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const screens = Grid.useBreakpoint();

  const handleLogout = () => {
    localStorage.removeItem('payman-user');
    setUser(null);
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
      className="card-theme"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
        DAO{' '}
        <span style={{ fontWeight: 'normal', fontSize: '14px', color: '#aaa' }}>
          [{role}]
        </span>
      </div>
      {screens.md ? (
        <Space>
          <Button type="default" onClick={() => navigate('/insights')}>
            Insights
          </Button>
          <Button type="default" onClick={handleProfile}>
            Profile
          </Button>
          <Switch
            checked={dark}
            onChange={toggleTheme}
            checkedChildren={<BulbOutlined />}
            unCheckedChildren={<BulbOutlined />}
          />
          <Button type="primary" onClick={handleLogout}>
            Logout
          </Button>
        </Space>
      ) : (
        <Button
          type="text"
          icon={<MenuOutlined style={{ color: 'var(--text-color)' }} />}
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
              navigate('/insights');
              setDrawerOpen(false);
            }}
          >
            Insights
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
          <div style={{ marginBottom: 8, textAlign: 'center' }}>
            <Switch
              checked={dark}
              onChange={toggleTheme}
              checkedChildren={<BulbOutlined />}
              unCheckedChildren={<BulbOutlined />}
            />
          </div>
          <Button type="primary" block onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Drawer>
    </Header>
  );
};

export default Navbar;
