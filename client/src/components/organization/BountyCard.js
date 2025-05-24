import React from 'react';
import { Card, Typography, Tag, Button, Col } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import { deleteBounty } from '../../api/organization/bounties';
import formatDateBounty from '../../utils/formatDateBounty';
import toast from '../../utils/toast';

const { Text } = Typography;

const statusColors = {
  open: 'green',
  assigned: 'gold',
  pending_payment: 'blue',
  closed: 'red',
};

const BountyCard = ({ bounty, onView, onChatOpen, onRefetch }) => {
  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      await deleteBounty(bounty.id);
      onRefetch();
    } catch (err) {
      toast.error('Failed to delete bounty');
    }
  };

  return (
    <Col xs={24} sm={12} md={8}>
      <Card
        hoverable
        style={{ backgroundColor: '#1f1f1f' }}
        onClick={onView}
        title={<Text strong>{bounty.name}</Text>}
        extra={<Tag color={statusColors[bounty.status]}>{bounty.status}</Tag>}
      >
        {bounty.github ? (
          <Tag color="geekblue" style={{ marginBottom: '10px' }}>
            GitHub Issue
          </Tag>
        ) : (
          <>
            <p>
              <Tag color="blue">Deadline</Tag>{' '}
              {formatDateBounty(bounty.deadline) || 'N/A'}
            </p>
            <p>
              <Tag color="purple">Amount</Tag> ${bounty.amount || 0}
            </p>
          </>
        )}
        {bounty.issueLink && (
          <p>
            <Tag color="orange">Issue Link</Tag>{' '}
            <a
              href={bounty.issueLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Issue
            </a>
          </p>
        )}
        <p>{bounty.description}</p>
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

export default BountyCard;
