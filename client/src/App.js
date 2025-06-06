import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { routes } from './routes/RoutesConfig';

import { OrganizationInsights, ContributorInsights } from './pages';
import { Suspense } from 'react';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {routes.map(({ path, element, isPrivate }) => {
        if (path === '/insights') {
          return (
            <Route
              key={path}
              path={path}
              element={
                user ? (
                  user.role === 'organization' ? (
                    <OrganizationInsights user={user} />
                  ) : (
                    <ContributorInsights user={user} />
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
    <AuthProvider>
      <Router>
        <Suspense fallback={null}>
          <AppRoutes />
        </Suspense>
      </Router>
    </AuthProvider>
  );
};

export default App;
