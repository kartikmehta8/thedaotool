import React, { useEffect, useState } from 'react';
import { Typography, Row, Switch } from 'antd';
import { fetchBountysForContributor } from '../../api/contributor/bounties';
import { getContributorProfile } from '../../api/contributor/profile';

import {
  BountyCard,
  SubmitWorkModal,
  ChatModal,
} from '../../components/contributor';

const { Title } = Typography;

const ContributorDashboard = () => {
  const [bounties, setBountys] = useState([]);
  const [skills, setSkills] = useState([]);
  const [filterBySkills, setFilterBySkills] = useState(false);
  const [selected, setSelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [chatModalVisible, setChatModalVisible] = useState(false);

  const user = JSON.parse(localStorage.getItem('payman-user')) || {};
  const uid = user.uid;

  const loadBountys = async () => {
    const bountysData = await fetchBountysForContributor(uid);
    setBountys(bountysData);

    const profile = await getContributorProfile(uid);
    if (profile?.skills) {
      const formattedSkills = profile.skills
        .split(',')
        .map((s) => s.toLowerCase().trim());
      setSkills(formattedSkills);
    }
  };

  useEffect(() => {
    loadBountys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredBountys = bounties.filter((bounty) => {
    const statusAlwaysVisible = ['assigned', 'pending_payment'];

    if (statusAlwaysVisible.includes(bounty.status)) return true;
    if (!filterBySkills) return true;
    if (!Array.isArray(bounty.tags)) return false;

    return bounty.tags.some((tag) => skills.includes(tag.toLowerCase().trim()));
  });

  return (
    <div style={{ padding: '2rem' }}>
      <Title level={3} style={{ color: '#fff' }}>
        Available Bounties
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
        {filteredBountys.map((bounty) => (
          <BountyCard
            key={bounty.id}
            bounty={bounty}
            userId={uid}
            onRefetch={loadBountys}
            onOpenSubmitModal={() => {
              setSelected(bounty);
              setModalVisible(true);
            }}
            onOpenChat={() => {
              setSelected(bounty);
              setChatModalVisible(true);
            }}
          />
        ))}
      </Row>

      {selected && (
        <>
          <SubmitWorkModal
            visible={modalVisible}
            bountyId={selected.id}
            onCancel={() => setModalVisible(false)}
            onSubmitSuccess={loadBountys}
          />

          <ChatModal
            visible={chatModalVisible}
            bounty={selected}
            userId={uid}
            onCancel={() => setChatModalVisible(false)}
          />
        </>
      )}
    </div>
  );
};

export default ContributorDashboard;
