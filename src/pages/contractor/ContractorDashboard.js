import React, { useEffect, useState } from 'react';
import { Typography, Row } from 'antd';
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

  const fetchContracts = async () => {
    try {
      const q = query(
        collection(db, 'contracts'),
        where('status', '!=', 'closed')
      );
      const snap = await getDocs(q);
      const all = await Promise.all(
        snap.docs.map(async (docRef) => {
          const data = docRef.data();
          const businessSnap = await getDoc(
            doc(db, 'businesses', data.businessId)
          );
          return {
            id: docRef.id,
            ...data,
            businessInfo: businessSnap.exists() ? businessSnap.data() : {},
          };
        })
      );
      const filtered = all.filter(
        (c) => c.status === 'open' || c.contractorId === uid
      );
      setContracts(filtered);
    } catch (err) {
      toast.error('Failed to fetch contracts');
    }
  };

  useEffect(() => {
    fetchContracts();
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
            onRefetch={fetchContracts}
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
            onSubmitSuccess={fetchContracts}
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
