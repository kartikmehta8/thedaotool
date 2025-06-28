import React from 'react';
import { Flex, Typography, theme } from 'antd';
import Logo from '../assets/dao.png';

const { useToken } = theme;
const { Title } = Typography;

const AuthHeader = () => {
  const { token } = useToken();

  return (
    <Flex
      justify="center"
      align="center"
      gap="middle"
      style={{
        marginBottom: token.marginLG,
        padding: token.paddingLG,
        backgroundColor: token.colorBgContainer,
        borderRadius: token.borderRadiusLG,
      }}
    >
      <img
        src={Logo}
        alt="DAO Logo"
        style={{
          width: 60,
          height: 60,
          borderRadius: '20%',
          padding: token.paddingXXS,
        }}
      />
      <Title
        level={3}
        style={{
          margin: 0,
          fontWeight: token.fontWeightStrong,
        }}
      >
        The DAO Tool
      </Title>
    </Flex>
  );
};

export default AuthHeader;
