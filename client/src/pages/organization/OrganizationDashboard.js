import React, { useState, useEffect } from 'react';
import { Typography, Button, Row } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getBountysForOrganization } from '../../api/organization/bounties';
import { getApiKey } from '../../api/payman';

import {
  ChatModal,
  BountyCard,
  CreateBountyModal,
  ViewBountyModal,
} from '../../components/organization';

const { Title } = Typography;

const OrganizationDashboard = () => {
  const [bounties, setBountys] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [chatModal, setChatModal] = useState(false);
  const [chatBountyId, setChatBountyId] = useState(null);
  const [selectedBounty, setSelectedBounty] = useState(null);
  const [apiKey, setApiKey] = useState('');

  const user = JSON.parse(localStorage.getItem('payman-user')) || {};
  const uid = user.uid;

  const fetchBountys = async () => {
    const key = await getApiKey(uid);
    setApiKey(key);

    const fetchedBountys = await getBountysForOrganization(uid);
    setBountys(fetchedBountys);
  };

  const handleChatOpen = (bountyId) => {
    setChatBountyId(bountyId);
    setChatModal(true);
  };

  useEffect(() => {
    fetchBountys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <Title level={3} style={{ color: '#fff' }}>
        My Bounties
      </Title>
      <Button
        icon={<PlusOutlined />}
        onClick={() => setModalVisible(true)}
        type="primary"
        style={{ marginBottom: 16 }}
      >
        Create Bounty
      </Button>

      <Row gutter={[16, 16]}>
        {bounties.map((bounty) => (
          <BountyCard
            key={bounty.id}
            bounty={bounty}
            onView={() => {
              setSelectedBounty({ ...bounty });
              setViewModal(true);
            }}
            onChatOpen={() => handleChatOpen(bounty.id)}
            onRefetch={fetchBountys}
          />
        ))}
      </Row>

      <CreateBountyModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onCreateSuccess={fetchBountys}
        userId={uid}
      />

      {selectedBounty && (
        <ViewBountyModal
          visible={viewModal}
          bounty={selectedBounty}
          apiKey={apiKey}
          onCancel={() => setViewModal(false)}
          onUpdateSuccess={fetchBountys}
          setSelectedBounty={setSelectedBounty}
        />
      )}

      <ChatModal
        visible={chatModal}
        bountyId={chatBountyId}
        userId={uid}
        onClose={() => setChatModal(false)}
      />
    </div>
  );
};

export default OrganizationDashboard;
