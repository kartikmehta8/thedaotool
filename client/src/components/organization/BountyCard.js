import React from 'react';
import PropTypes from 'prop-types';
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
  paid: 'purple',
  closed: 'red',
};

const BountyCard = ({ bounty, onView, onChatOpen, onRefetch }) => {
  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      await deleteBounty(bounty.id);
      toast.success('Bounty deleted successfully');
      onRefetch();
    } catch (err) {
      toast.error('Failed to delete bounty');
    }
  };

  return (
    <Col xs={24} sm={12} md={8}>
      <Card
        hoverable
        className="card-theme"
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
              <Tag color="purple">Amount</Tag> {bounty.amount || 0} SOL
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
          icon={<MessageOutlined aria-hidden="true" />}
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

BountyCard.propTypes = {
  bounty: PropTypes.object.isRequired,
  onView: PropTypes.func.isRequired,
  onChatOpen: PropTypes.func,
  onRefetch: PropTypes.func.isRequired,
};

export default BountyCard;
