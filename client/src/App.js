import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import {
  Signup,
  Login,
  Dashboard,
  Landing,
  BusinessProfile,
  ContractorProfile,
  BusinessPaymentHistory,
  ContractorPaymentHistory,
} from './pages';

import { ConfigProvider, theme } from 'antd';

const App = () => {
  const [user, setUser] = useState(() => {
    const localUser = localStorage.getItem('payman-user');
    return localUser ? JSON.parse(localUser) : null;
  });

  useEffect(() => {
    const syncUser = () => {
      const localUser = localStorage.getItem('payman-user');
      setUser(localUser ? JSON.parse(localUser) : null);
    };

    window.addEventListener('storage', syncUser);
    syncUser();

    return () => window.removeEventListener('storage', syncUser);
  }, []);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          fontFamily: 'Reddit Sans, sans-serif',
        },
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              user ? <Dashboard user={user} /> : <Navigate to="/login" />
            }
          />
          <Route path="/profile/business" element={<BusinessProfile />} />
          <Route path="/profile/contractor" element={<ContractorProfile />} />
          <Route
            path="/payment-history"
            element={
              user && user.role === 'business' ? (
                <BusinessPaymentHistory user={user} />
              ) : (
                <ContractorPaymentHistory user={user} />
              )
            }
          />
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

export default App;
