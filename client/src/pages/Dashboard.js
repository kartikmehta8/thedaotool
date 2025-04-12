import React from 'react';
import { Navbar } from '../components';
import { Layout } from 'antd';
import BusinessDashboard from './business/BusinessDashboard';
import ContractorDashboard from './contractor/ContractorDashboard';

const { Content } = Layout;

const Dashboard = ({ user }) => {
  const role = user?.role;

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#141414' }}>
      <Navbar />
      <Content style={{ padding: '2rem' }}>
        {role === 'business' && <BusinessDashboard />}
        {role === 'contractor' && <ContractorDashboard />}
        {!role && (
          <div style={{ color: '#fff' }}>
            Unable to determine your role. Please contact support.
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default Dashboard;
