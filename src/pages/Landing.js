import React from "react";
import { Typography, Button, Layout, Row, Col, Card } from "antd";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
const { Title, Paragraph } = Typography;
const { Content } = Layout;

const Landing = () => {
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#141414" }}>
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "3rem",
        }}
      >
        <Card
          style={{
            backgroundColor: "#1f1f1f",
            width: "100%",
            maxWidth: "900px",
            padding: "2rem",
          }}
        >
          <Row gutter={[32, 32]} align="middle" justify="center">
            <Col xs={24} md={12}>
              <Title style={{ color: "#fff" }}>
                Bizzy Network
              </Title>
              <Paragraph style={{ color: "#d9d9d9", fontSize: "16px" }}>
                Businesses want to <strong>scale quickly</strong> but lack the
                budget to hire full-time employees. They struggle with{" "}
                <strong>finding and paying contractors efficiently</strong>,
                leading to delays in execution.
              </Paragraph>
              <Paragraph style={{ color: "#d9d9d9", fontSize: "16px" }}>
                Bizzy Network helps identify the right talent, manage payments
                via ACH, and stay compliant — fast.
              </Paragraph>
              <Button
                type="primary"
                size="large"
                onClick={() => navigate("/signup")}
              >
                Get Started
              </Button>
            </Col>
            <Col xs={24} md={12}>
              <img
                src={logo}
                alt="AI Contractor Agent"
                style={{ width: "100%", borderRadius: "16px" }}
              />
            </Col>
          </Row>
        </Card>
      </Content>
    </Layout>
  );
};
export default Landing;
