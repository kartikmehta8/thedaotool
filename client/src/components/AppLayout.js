import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import Navbar from './Navbar';

const { Content } = Layout;

const AppLayout = ({ children, contentProps }) => (
  <Layout style={{ minHeight: '100vh' }}>
    <Navbar />
    <Content {...contentProps}>
      <main className="page-container" role="main">
        {children}
      </main>
    </Content>
  </Layout>
);

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
  contentProps: PropTypes.object,
};

AppLayout.defaultProps = {
  contentProps: {},
};

export default AppLayout;
