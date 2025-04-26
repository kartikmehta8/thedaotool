import React from 'react';
import { Card, Typography, Tag, Button, Col } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import { deleteContract } from '../../api/business/contracts';
import formatDate from '../../utils/formatDate';

const { Text } = Typography;

const statusColors = {
  open: 'green',
  assigned: 'gold',
  pending_payment: 'blue',
  closed: 'red',
};

const ContractCard = ({ contract, onView, onChatOpen, onRefetch }) => {
  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      await deleteContract(contract.id);
      onRefetch();
    } catch (err) {
      console.error('Failed to delete contract:', err);
    }
  };

  return (
    <Col xs={24} sm={12} md={8}>
      <Card
        hoverable
        style={{ backgroundColor: '#1f1f1f' }}
        onClick={onView}
        title={<Text strong>{contract.name}</Text>}
        extra={
          <Tag color={statusColors[contract.status]}>{contract.status}</Tag>
        }
      >
        {contract.github ? (
          <Tag color="geekblue" style={{ marginBottom: '10px' }}>
            GitHub Issue
          </Tag>
        ) : (
          <>
            <p>
              <Tag color="blue">Deadline</Tag>{' '}
              {formatDate(contract.deadline) || 'N/A'}
            </p>
            <p>
              <Tag color="purple">Amount</Tag> ${contract.amount || 0}
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
        <Button key="delete" danger onClick={handleDelete}>
          Delete
        </Button>{' '}
        <Button
          icon={<MessageOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            onChatOpen();
          }}
        >
          Chat
        </Button>
      </Card>
    </Col>
  );
};

export default ContractCard;
