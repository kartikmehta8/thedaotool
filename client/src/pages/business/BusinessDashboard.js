import React, { useState, useEffect } from 'react';
import { Typography, Button, Row } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getContractsForBusiness } from '../../api/firebaseBusiness';
import { getApiKey } from '../../api/payman';

import {
  ChatModal,
  ContractCard,
  CreateContractModal,
  ViewContractModal,
} from '../../components/business';

const { Title } = Typography;

const BusinessDashboard = () => {
  const [contracts, setContracts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [chatModal, setChatModal] = useState(false);
  const [chatContractId, setChatContractId] = useState(null);
  const [selectedContract, setSelectedContract] = useState(null);
  const [apiKey, setApiKey] = useState('');

  const user = JSON.parse(localStorage.getItem('payman-user')) || {};
  const uid = user.uid;

  const fetchContracts = async () => {
    const key = await getApiKey(uid);
    setApiKey(key);

    const fetchedContracts = await getContractsForBusiness(uid);
    setContracts(fetchedContracts);
  };

  const handleChatOpen = (contractId) => {
    setChatContractId(contractId);
    setChatModal(true);
  };

  useEffect(() => {
    fetchContracts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <Title level={3} style={{ color: '#fff' }}>
        My Contracts
      </Title>
      <Button
        icon={<PlusOutlined />}
        onClick={() => setModalVisible(true)}
        type="primary"
        style={{ marginBottom: 16 }}
      >
        Create Contract
      </Button>

      <Row gutter={[16, 16]}>
        {contracts.map((contract) => (
          <ContractCard
            key={contract.id}
            contract={contract}
            onView={() => {
              setSelectedContract({ ...contract });
              setViewModal(true);
            }}
            onChatOpen={() => handleChatOpen(contract.id)}
            onRefetch={fetchContracts}
          />
        ))}
      </Row>

      <CreateContractModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onCreateSuccess={fetchContracts}
        userId={uid}
      />

      {selectedContract && (
        <ViewContractModal
          visible={viewModal}
          contract={selectedContract}
          apiKey={apiKey}
          onCancel={() => setViewModal(false)}
          onUpdateSuccess={fetchContracts}
          setSelectedContract={setSelectedContract}
        />
      )}

      <ChatModal
        visible={chatModal}
        contractId={chatContractId}
        userId={uid}
        onClose={() => setChatModal(false)}
      />
    </div>
  );
};

export default BusinessDashboard;
