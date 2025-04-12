import React, { useState } from 'react';
import { Modal, Button, Typography } from 'antd';
import { InfoCircleOutlined, CloseOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const InfoPopup = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        type="primary"
        style={{
          position: 'fixed',
          top: 20,
          left: 20,
          zIndex: 9999,
          color: '#fff',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          border: 'none',
          transition: 'transform 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <InfoCircleOutlined style={{ fontSize: '20px', marginRight: '8px' }} />
        Discover
      </Button>

      <Modal
        title={null}
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={700}
        closeIcon={
          <CloseOutlined style={{ color: '#ffffff', fontSize: '20px' }} />
        }
        bodyStyle={{
          background: 'linear-gradient(135deg, #141414, #1f1f1f)',
          color: '#ffffff',
          borderRadius: '16px',
          padding: '2rem',
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
        style={{
          top: 40,
          backdropFilter: 'blur(10px)',
          background: 'rgba(0,0,0,0.5)',
        }}
      >
        <Paragraph
          style={{
            color: '#d9d9d9',
            fontSize: '16px',
            marginBottom: '1.5rem',
          }}
        >
          <strong>Bizzy Network</strong> is a full-stack, payman-based task
          marketplace designed to connect businesses with contractors
          seamlessly. It leverages Firebase, React, and PaymanAI's payment SDKs
          to automate and streamline every step from contract creation to final
          payment.
        </Paragraph>

        <Title level={4} style={{ color: '#04BEFE', marginBottom: '1rem' }}>
          Features
        </Title>
        <ul
          style={{
            color: '#d9d9d9',
            paddingLeft: '1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          {[
            'Create & manage contracts with task details, deadlines, and budgets',
            'Assign contractors and track status: open, assigned, pending_payment, paid',
            'Payee creation + secure payments using PaymanAI SDK',
            'Real-time chat between business and contractor per contract',
            'Clean, dark-themed UI with role-based dashboards',
            'Manage profile details, tags, and skills',
          ].map((feature, index) => (
            <li
              key={index}
              style={{
                marginBottom: '0.5rem',
                position: 'relative',
                paddingLeft: '1rem',
              }}
            >
              {feature}
            </li>
          ))}
        </ul>

        <Title level={4} style={{ color: '#04BEFE', marginBottom: '1rem' }}>
          Payment Flow
        </Title>
        <Paragraph
          style={{
            color: '#d9d9d9',
            fontSize: '16px',
            marginBottom: '1.5rem',
          }}
        >
          Businesses create a payee profile for each contractor and can then
          send payments directly once work is submitted. All transactions are
          handled securely via the PaymanAI SDK.
        </Paragraph>

        <Title
          level={4}
          style={{ color: '#04BEFE', marginTop: '2rem', marginBottom: '1rem' }}
        >
          SWOT Analysis
        </Title>
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              border: '1px solid rgba(255,255,255,0.1)',
              marginTop: '1rem',
              color: '#fff',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <th
                  style={{
                    padding: '12px',
                    textAlign: 'left',
                    color: '#04BEFE',
                  }}
                >
                  Strengths
                </th>
                <th
                  style={{
                    padding: '12px',
                    textAlign: 'left',
                    color: '#04BEFE',
                  }}
                >
                  Opportunities
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '12px', verticalAlign: 'top' }}>
                  <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
                    <li>
                      Covers full contract lifecycle (create → assign → submit →
                      pay)
                    </li>
                    <li>
                      Seamless payee creation and direct payments via PaymanAI
                      SDK
                    </li>
                  </ul>
                </td>
                <td style={{ padding: '12px', verticalAlign: 'top' }}>
                  <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
                    <li>
                      Leverage international payout rails as they roll out
                    </li>
                    <li>
                      Offer premium features like analytics, escrow, and
                      automation
                    </li>
                  </ul>
                </td>
              </tr>
              <tr style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                <th
                  style={{
                    padding: '12px',
                    textAlign: 'left',
                    color: '#04BEFE',
                  }}
                >
                  Weaknesses
                </th>
                <th
                  style={{
                    padding: '12px',
                    textAlign: 'left',
                    color: '#04BEFE',
                  }}
                >
                  Threats
                </th>
              </tr>
              <tr>
                <td style={{ padding: '12px', verticalAlign: 'top' }}>
                  <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
                    <li>
                      Payee creation still requires business-side manual input
                    </li>
                    <li>
                      Lack of deep reporting, summaries, or dashboards (in
                      development)
                    </li>
                  </ul>
                </td>
                <td style={{ padding: '12px', verticalAlign: 'top' }}>
                  <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
                    <li>
                      Any PaymanAI API issues can impact critical payment
                      workflows
                    </li>
                    <li>
                      Competitors like Deel, Upwork, or Toptal offer similar
                      ecosystems
                    </li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Modal>
    </>
  );
};

export default InfoPopup;
