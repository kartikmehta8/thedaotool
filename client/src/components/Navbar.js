import React, { useState } from 'react';
import { Layout, Button, Space, Drawer, Grid, Switch } from 'antd';
import {
  MenuOutlined,
  BulbOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTour } from '../context/TourContext';

const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const { startTour, completed } = useTour();
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
      role="navigation"
      aria-label="Main navigation"
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
          <Button type="default" onClick={() => navigate('/wallet')}>
            Wallet
          </Button>
          <Button
            data-tour="profile-menu"
            type="default"
            onClick={handleProfile}
          >
            Profile
          </Button>
          <Switch
            aria-label="Toggle dark mode"
            checked={dark}
            onChange={toggleTheme}
            checkedChildren={<BulbOutlined aria-hidden="true" />}
            unCheckedChildren={<BulbOutlined aria-hidden="true" />}
          />
          {!completed && (
            <Button
              type="text"
              aria-label="Start tour"
              icon={<QuestionCircleOutlined aria-hidden="true" />}
              onClick={startTour}
            />
          )}
          <Button type="primary" onClick={handleLogout}>
            Logout
          </Button>
        </Space>
      ) : (
        <Button
          type="text"
          aria-label="Open menu"
          icon={
            <MenuOutlined
              aria-hidden="true"
              style={{ color: 'var(--text-color)' }}
            />
          }
          onClick={() => setDrawerOpen(true)}
        />
      )}
      <Drawer
        placement="right"
        role="dialog"
        aria-label="Navigation menu"
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
              navigate('/wallet');
              setDrawerOpen(false);
            }}
          >
            Wallet
          </Button>
          <Button
            data-tour="profile-menu"
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
              aria-label="Toggle dark mode"
              checked={dark}
              onChange={toggleTheme}
              checkedChildren={<BulbOutlined aria-hidden="true" />}
              unCheckedChildren={<BulbOutlined aria-hidden="true" />}
            />
          </div>
          {!completed && (
            <Button
              block
              type="text"
              style={{ marginBottom: 8 }}
              icon={<QuestionCircleOutlined aria-hidden="true" />}
              onClick={() => {
                startTour();
                setDrawerOpen(false);
              }}
            >
              Start Tour
            </Button>
          )}
          <Button type="primary" block onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Drawer>
    </Header>
  );
};

export default Navbar;
