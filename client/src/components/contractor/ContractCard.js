import React from 'react';
import { Card, Typography, Tag, Button, Col } from 'antd';
import { applyToContract, unassignSelf } from '../../api/contractor/contracts';
import toast from '../../utils/toast';
import formatDateContract from '../../utils/formatDateContract';

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
  const handleApplyToContract = async () => {
    try {
      await applyToContract(contract.id, userId);
      onRefetch();
      toast.success('Contract assigned successfully');
    } catch (err) {
      console.error('Failed to apply to contract');
    }
  };

  const handleUnassign = async () => {
    try {
      await unassignSelf(contract.id);
      onRefetch();
      toast.success('Unassigned from contract successfully');
    } catch (err) {
      console.error('Failed to unassign from contract');
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

        {contract.github ? (
          <Tag color="geekblue" style={{ marginBottom: '10px' }}>
            GitHub Issue
          </Tag>
        ) : (
          <>
            <p>
              <Tag color="blue">Deadline</Tag>{' '}
              {formatDateContract(contract.deadline)}
            </p>
            <p>
              <Tag color="purple">Amount</Tag> ${contract.amount}
            </p>
          </>
        )}
        {contract.issueLink && (
          <p>
            <Tag color="orange">Issue Link</Tag>{' '}
            <a
              href={contract.issueLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Issue
            </a>
          </p>
        )}

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
          <Button onClick={handleApplyToContract} type="primary" block>
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

            <Button
              danger
              onClick={handleUnassign}
              block
              style={{ marginTop: 8 }}
            >
              Unassign Myself
            </Button>
          </>
        )}
      </Card>
    </Col>
  );
};

export default ContractCard;
