import React from 'react';
import AppLayout from '../components/AppLayout';
import OrganizationDashboard from './organization/OrganizationDashboard';
import ContributorDashboard from './contributor/ContributorDashboard';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const role = user.role;

  return (
    <AppLayout>
      {role === 'organization' && <OrganizationDashboard />}
      {role === 'contributor' && <ContributorDashboard />}
      {!role && (
        <div>Unable to determine your role. Please contact support.</div>
      )}
    </AppLayout>
  );
};

export default Dashboard;
