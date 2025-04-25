import React, { useEffect, useState } from 'react';
import { Typography, Row, Switch } from 'antd';
import {
  fetchContractsForContractor,
  getContractorProfile,
} from '../../api/firebaseContractor';
import {
  ContractCard,
  SubmitWorkModal,
  ChatModal,
} from '../../components/contractor';

const { Title } = Typography;

const ContractorDashboard = () => {
  const [contracts, setContracts] = useState([]);
  const [skills, setSkills] = useState([]);
  const [filterBySkills, setFilterBySkills] = useState(false);
  const [selected, setSelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [chatModalVisible, setChatModalVisible] = useState(false);

  const user = JSON.parse(localStorage.getItem('payman-user')) || {};
  const uid = user.uid;

  const loadContracts = async () => {
    const contractsData = await fetchContractsForContractor(uid);
    setContracts(contractsData);

    const profile = await getContractorProfile(uid);
    if (profile?.skills) {
      const formattedSkills = profile.skills
        .split(',')
        .map((s) => s.toLowerCase().trim());
      setSkills(formattedSkills);
    }
  };

  useEffect(() => {
    loadContracts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredContracts = contracts.filter((contract) => {
    const statusAlwaysVisible = ['assigned', 'pending_payment'];

    if (statusAlwaysVisible.includes(contract.status)) return true;
    if (!filterBySkills) return true;
    if (!Array.isArray(contract.tags)) return false;

    return contract.tags.some((tag) =>
      skills.includes(tag.toLowerCase().trim())
    );
  });

  return (
    <div style={{ padding: '2rem' }}>
      <Title level={3} style={{ color: '#fff' }}>
        Available Contracts
      </Title>

      <div style={{ marginBottom: '1rem' }}>
        <span style={{ color: '#fff', marginRight: '0.5rem' }}>
          Filter by Matching Skills
        </span>
        <Switch
          checked={filterBySkills}
          onChange={(checked) => setFilterBySkills(checked)}
        />
      </div>

      <Row gutter={[16, 16]}>
        {filteredContracts.map((contract) => (
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
