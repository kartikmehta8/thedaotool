import React from 'react';
import { Navbar } from '../components';
import { Layout } from 'antd';
import OrganizationDashboard from './organization/OrganizationDashboard';
import ContributorDashboard from './contributor/ContributorDashboard';
import { useAuth } from '../context/AuthContext';

const { Content } = Layout;

const Dashboard = () => {
  const { user } = useAuth();
  const role = user.role;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />
      <Content className="page-container">
        {role === 'organization' && <OrganizationDashboard />}
        {role === 'contributor' && <ContributorDashboard />}
        {!role && (
          <div>Unable to determine your role. Please contact support.</div>
        )}
      </Content>
    </Layout>
  );
};

export default Dashboard;
