import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import { AuthProvider, useAuth } from './context/AuthContext';
import { routes } from './routes/RoutesConfig';

import { BusinessPaymentHistory, ContractorPaymentHistory } from './pages';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {routes.map(({ path, element, isPrivate }) => {
        if (path === '/payment-history') {
          return (
            <Route
              key={path}
              path={path}
              element={
                user ? (
                  user.role === 'business' ? (
                    <BusinessPaymentHistory user={user} />
                  ) : (
                    <ContractorPaymentHistory user={user} />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          );
        }
        if (isPrivate) {
          return (
            <Route
              key={path}
              path={path}
              element={user ? element : <Navigate to="/login" />}
            />
          );
        }
        return <Route key={path} path={path} element={element} />;
      })}
    </Routes>
  );
};

const App = () => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: { fontFamily: 'Reddit Sans, sans-serif' },
      }}
    >
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;
