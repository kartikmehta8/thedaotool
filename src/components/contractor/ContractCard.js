import React from 'react';
import { Card, Typography, Tag, Button, Col } from 'antd';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../providers/firebase';
import toast from '../../utils/toast';

const { Text } = Typography;

const statusColors = {
  open: 'green',
  assigned: 'gold',
  pending_payment: 'blue',
  closed: 'red',
};

const ContractCard = ({
  contract,
  userId,
  onRefetch,
  onOpenSubmitModal,
  onOpenChat,
}) => {
  const applyToContract = async () => {
    try {
      await updateDoc(doc(db, 'contracts', contract.id), {
        status: 'assigned',
        contractorId: userId,
      });
      toast.success('Applied to contract');
      onRefetch();
    } catch (err) {
      toast.error('Application failed');
    }
  };

  return (
    <Col xs={24} sm={12} md={8}>
      <Card
        hoverable
        style={{ backgroundColor: '#1f1f1f' }}
        title={<Text strong>{contract.name}</Text>}
        extra={
          <Tag color={statusColors[contract.status]}>{contract.status}</Tag>
        }
      >
        <p>
          <Tag color="cyan">Company</Tag>{' '}
          {contract.businessInfo?.companyName || 'Unknown'}
        </p>
        <p>
          <Tag color="blue">Deadline</Tag> {contract.deadline}
        </p>
        <p>
          <Tag color="purple">Amount</Tag> ${contract.amount}
        </p>
        <p>{contract.description}</p>

        {Array.isArray(contract.tags) && contract.tags.length > 0 && (
          <div style={{ margin: '8px 0' }}>
            {contract.tags.map((tag) => (
              <Tag key={tag} color="pink" style={{ marginBottom: 4 }}>
                {tag}
              </Tag>
            ))}
          </div>
        )}

        {contract.status === 'open' && (
          <Button onClick={applyToContract} type="primary" block>
            Apply
          </Button>
        )}

        {contract.contractorId === userId && (
          <>
            {contract.status === 'assigned' && (
              <Button
                type="dashed"
                block
                onClick={onOpenSubmitModal}
                style={{ marginBottom: 8 }}
              >
                Submit Work
              </Button>
            )}

            <Button type="default" block onClick={onOpenChat}>
              Open Chat
            </Button>
          </>
        )}
      </Card>
    </Col>
  );
};

export default ContractCard;
