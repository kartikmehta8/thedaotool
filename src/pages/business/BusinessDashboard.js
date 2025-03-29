import React, { useState, useEffect } from 'react';
import { Typography, Button, Row } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../../providers/firebase';
import toast from '../../utils/toast';

import {
  ChatModal,
  ContractCard,
  CreateContractModal,
  ViewContractModal,
} from '../../components/business';

const { Title } = Typography;

const BusinessDashboard = () => {
  const [contracts, setContracts] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [chatModal, setChatModal] = useState(false);
  const [chatContractId, setChatContractId] = useState(null);
  const [selectedContract, setSelectedContract] = useState(null);
  const [apiKey, setApiKey] = useState('');

  const user = JSON.parse(localStorage.getItem('payman-user')) || {};
  const uid = user.uid;

  const fetchContracts = async () => {
    try {
      const businessSnap = await getDoc(doc(db, 'businesses', uid));
      const key = businessSnap.data()?.apiKey;
      setApiKey(key);

      const q = query(
        collection(db, 'contracts'),
        where('businessId', '==', uid)
      );
      const snapshot = await getDocs(q);
      const docs = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          let contractorInfo = null;

          if (data.contractorId) {
            const contractorRef = doc(db, 'contractors', data.contractorId);
            const contractorSnap = await getDoc(contractorRef);
            if (contractorSnap.exists()) {
              contractorInfo = {
                id: data.contractorId,
                ...contractorSnap.data(),
              };
            }
          }

          return {
            id: docSnap.id,
            ...data,
            contractorInfo,
          };
        })
      );
      setContracts(docs);
    } catch (err) {
      toast.error('Error fetching contracts');
    } finally {
      setLoading(false);
    }
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
