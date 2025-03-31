import React, { useEffect, useState } from 'react';
import { Typography, Row } from 'antd';
import { fetchContractsForContractor } from '../../api/firebaseContractor';
import {
  ContractCard,
  SubmitWorkModal,
  ChatModal,
} from '../../components/contractor';

const { Title } = Typography;

const ContractorDashboard = () => {
  const [contracts, setContracts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [chatModalVisible, setChatModalVisible] = useState(false);

  const user = JSON.parse(localStorage.getItem('payman-user')) || {};
  const uid = user.uid;

  const loadContracts = async () => {
    const contractsData = await fetchContractsForContractor(uid);
    setContracts(contractsData);
  };

  useEffect(() => {
    loadContracts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <Title level={3} style={{ color: '#fff' }}>
        Available Contracts
      </Title>
      <Row gutter={[16, 16]}>
        {contracts.map((contract) => (
          <ContractCard
            key={contract.id}
            contract={contract}
            userId={uid}
            onRefetch={loadContracts}
            onOpenSubmitModal={() => {
              setSelected(contract);
              setModalVisible(true);
            }}
            onOpenChat={() => {
              setSelected(contract);
              setChatModalVisible(true);
            }}
          />
        ))}
      </Row>

      {selected && (
        <>
          <SubmitWorkModal
            visible={modalVisible}
            contractId={selected.id}
            onCancel={() => setModalVisible(false)}
            onSubmitSuccess={loadContracts}
          />

          <ChatModal
            visible={chatModalVisible}
            contract={selected}
            userId={uid}
            onCancel={() => setChatModalVisible(false)}
          />
        </>
      )}
    </div>
  );
};

export default ContractorDashboard;
