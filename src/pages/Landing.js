import React, { useState } from 'react';
import { Typography, Button, Layout, Row, Col, Card, Space } from 'antd';
import {
  RocketOutlined,
  DollarOutlined,
  TeamOutlined,
  GithubOutlined,
  TwitterOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import InfoPopup from '../components/InfoPopup';

import heroImage from '../assets/main.png';

const { Title, Text, Paragraph } = Typography;
const { Content, Footer } = Layout;

const LandingPage = () => {
  const navigate = useNavigate();
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      icon: <RocketOutlined />,
      title: 'Effortless Contract Management',
      description:
        'Streamline your contract workflow from creation to completion.',
    },
    {
      icon: <DollarOutlined />,
      title: 'Seamless Payments',
      description:
        'Instant, secure contractor payments powered by PaymanAI SDK.',
    },
    {
      icon: <TeamOutlined />,
      title: 'Real-time Collaboration',
      description:
        'Enhance communication with integrated chat & status tracking.',
    },
  ];

  return (
    <Layout
      style={{
        minHeight: '100vh',
        backgroundColor: '#0A0A0A',
        color: '#ffffff',
        overflow: 'hidden',
      }}
    >
      {/* Info Popup */}
      <InfoPopup />

      {/* Hero Section */}
      <Content
        style={{
          padding: '4rem 2rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Row gutter={[32, 32]} align="middle" justify="center">
          <Col xs={24} md={12}>
            <Space
              direction="vertical"
              size="large"
              style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '2rem',
                borderRadius: '16px',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Title
                level={1}
                style={{
                  color: '#ffffff',
                  marginBottom: 0,
                  background: 'linear-gradient(90deg, #ffffff, #a0a0a0)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Bizzy Network
              </Title>
              <Paragraph
                style={{
                  color: '#d9d9d9',
                  fontSize: '18px',
                  maxWidth: '500px',
                }}
              >
                Revolutionize your business operations with an intelligent
                contractor marketplace that seamlessly connects talent, manages
                workflows, and accelerates growth.
              </Paragraph>
              <Space>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => navigate('/signup')}
                  icon={<ArrowRightOutlined />}
                >
                  Get Started
                </Button>
              </Space>
            </Space>
          </Col>
          <Col xs={24} md={12}>
            <div
              style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '16px',
                padding: '1rem',
                backdropFilter: 'blur(10px)',
              }}
            >
              <img
                src={heroImage}
                alt="Bizzy Network Workflow"
                style={{
                  width: '100%',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                }}
              />
            </div>
          </Col>
        </Row>
      </Content>

      {/* Features Section */}
      <Content
        style={{
          backgroundColor: 'transparent',
          padding: '0rem 2rem 4rem 2rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Row gutter={[32, 32]} justify="center">
          {features.map((feature, index) => (
            <Col key={index} xs={24} md={8}>
              <Card
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  color: '#ffffff',
                  height: '100%',
                  borderRadius: '16px',
                  transition: 'all 0.3s ease',
                  transform:
                    hoveredFeature === index ? 'scale(1.05)' : 'scale(1)',
                  backdropFilter: 'blur(10px)',
                  border: 'none',
                  boxShadow:
                    hoveredFeature === index
                      ? '0 15px 30px rgba(0,0,0,0.3)'
                      : '0 10px 20px rgba(0,0,0,0.2)',
                }}
              >
                <Space
                  direction="vertical"
                  align="center"
                  style={{ width: '100%', height: '100%' }}
                >
                  {React.cloneElement(feature.icon, {
                    style: {
                      fontSize: '48px',
                      color: hoveredFeature === index ? '#ffffff' : '#1890ff',
                      transition: 'color 0.3s ease',
                    },
                  })}
                  <Title
                    level={4}
                    style={{
                      color: hoveredFeature === index ? '#ffffff' : '#ffffff',
                      textAlign: 'center',
                      marginTop: '1rem',
                    }}
                  >
                    {feature.title}
                  </Title>
                  <Text
                    style={{
                      color: hoveredFeature === index ? '#ffffff' : '#d9d9d9',
                      textAlign: 'center',
                    }}
                  >
                    {feature.description}
                  </Text>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </Content>

      {/* Footer */}
      <Footer
        style={{
          backgroundColor: 'transparent',
          color: '#ffffff',
          textAlign: 'center',
        }}
      >
        <Space direction="vertical" size="large">
          <Space>
            <a
              href="https://github.com/kartikmehta8/bizzy-network"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubOutlined style={{ fontSize: '24px', color: '#ffffff' }} />
            </a>
            <a
              href="https://x.com/kartik_mehta8"
              target="_blank"
              rel="noopener noreferrer"
            >
              <TwitterOutlined style={{ fontSize: '24px', color: '#ffffff' }} />
            </a>
          </Space>
          <Text style={{ color: '#d9d9d9' }}>
            © 2025 Bizzy Network. Powered by PaymanAI.
          </Text>
        </Space>
      </Footer>

      {/* Background Gradient Effect */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'radial-gradient(circle at 10% 20%, rgba(98, 83, 225, 0.2) 0%, transparent 70%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
    </Layout>
  );
};

export default LandingPage;
