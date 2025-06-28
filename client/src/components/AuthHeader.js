import React from 'react';
import { Flex } from 'antd';
import Logo from '../assets/dao.png';

const AuthHeader = () => (
  <Flex justify="center" align="center" vertical style={{ marginBottom: 20 }}>
    <img src={Logo} alt="DAO Logo" style={{ width: 64, height: 64 }} />
    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: 8 }}>
      DAO Tool
    </div>
  </Flex>
);

export default AuthHeader;
