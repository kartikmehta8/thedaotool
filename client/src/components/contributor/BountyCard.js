import React from 'react';
import PropTypes from 'prop-types';
import { Card, Typography, Tag, Button, Col } from 'antd';
import { applyToBounty, unassignSelf } from '../../api/contributor/bounties';
import toast from '../../utils/toast';
import formatDateBounty from '../../utils/formatDateBounty';
import truncateWords from '../../utils/truncateWords';
import { useAuth } from '../../context/AuthContext';

const { Text } = Typography;

const statusColors = {
  open: 'green',
  assigned: 'gold',
  pending_payment: 'blue',
  paid: 'purple',
  closed: 'red',
};

const BountyCard = ({
  bounty,
  userId,
  onRefetch,
  onOpenSubmitModal,
  onOpenChat,
}) => {
  const { user } = useAuth();
  const emailVerified = user?.emailVerified || false;
  const handleApplyToBounty = async () => {
    if (!emailVerified) {
      toast.warning('Please verify your email before applying');
      return;
    }
    try {
      await applyToBounty(bounty.id);
      onRefetch();
      toast.success('Bounty assigned successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to apply to bounty');
    }
  };

  const handleUnassign = async () => {
    try {
      await unassignSelf(bounty.id);
      onRefetch();
      toast.success('Unassigned from bounty successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to unassign from bounty');
    }
  };

  return (
    <Col xs={24} sm={12} md={8}>
      <Card
        hoverable
        className="card-theme"
        title={<Text strong>{bounty.name}</Text>}
        extra={<Tag color={statusColors[bounty.status]}>{bounty.status}</Tag>}
      >
        <p>
          <Tag color="cyan">Company</Tag>{' '}
          {bounty.organizationInfo?.companyName || 'Unknown'}
        </p>

        {bounty.github ? (
          <Tag color="geekblue" style={{ marginBottom: '10px' }}>
            GitHub Issue
          </Tag>
        ) : (
          <>
            <p>
              <Tag color="blue">Deadline</Tag>{' '}
              {formatDateBounty(bounty.deadline)}
            </p>
            <p>
              <Tag color="purple">Amount</Tag> {bounty.amount} SOL
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

        <p>{truncateWords(bounty.description)}</p>

        {Array.isArray(bounty.tags) && bounty.tags.length > 0 && (
          <div style={{ margin: '8px 0' }}>
            {bounty.tags.map((tag) => (
              <Tag key={tag} color="pink" style={{ marginBottom: 4 }}>
                {tag}
              </Tag>
            ))}
          </div>
        )}

        {bounty.status === 'open' && (
          <Button onClick={handleApplyToBounty} type="primary" block>
            Apply
          </Button>
        )}

        {bounty.contributorId === userId && (
          <>
            {bounty.status === 'assigned' && (
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

BountyCard.propTypes = {
  bounty: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  onRefetch: PropTypes.func.isRequired,
  onOpenSubmitModal: PropTypes.func,
  onOpenChat: PropTypes.func,
};

export default BountyCard;
