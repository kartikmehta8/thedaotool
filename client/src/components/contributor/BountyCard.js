import React from 'react';
import { Card, Typography, Tag, Button, Col } from 'antd';
import { applyToBounty, unassignSelf } from '../../api/contributor/bounties';
import toast from '../../utils/toast';
import formatDateBounty from '../../utils/formatDateBounty';

const { Text } = Typography;

const statusColors = {
  open: 'green',
  assigned: 'gold',
  pending_payment: 'blue',
  closed: 'red',
};

const BountyCard = ({
  bounty,
  userId,
  onRefetch,
  onOpenSubmitModal,
  onOpenChat,
}) => {
  const emailVerified =
    JSON.parse(localStorage.getItem('payman-user'))?.emailVerified || false;
  const handleApplyToBounty = async () => {
    if (!emailVerified) {
      toast.warning('Please verify your email before applying');
      return;
    }
    try {
      await applyToBounty(bounty.id, userId);
      onRefetch();
      toast.success('Bounty assigned successfully');
    } catch (err) {
      toast.error('Failed to apply to bounty');
    }
  };

  const handleUnassign = async () => {
    try {
      await unassignSelf(bounty.id);
      onRefetch();
      toast.success('Unassigned from bounty successfully');
    } catch (err) {
      toast.error('Failed to unassign from bounty');
    }
  };

  return (
    <Col xs={24} sm={12} md={8}>
      <Card
        hoverable
        style={{ backgroundColor: '#1f1f1f' }}
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
              <Tag color="purple">Amount</Tag> ${bounty.amount}
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

export default BountyCard;
