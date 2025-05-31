import React from 'react';
import { Modal, Divider, Select, Button, InputNumber, Row, Col } from 'antd';
import {
  updateBounty,
  unassignContributor,
} from '../../api/organization/bounties';

import toast from '../../utils/toast';
import formatDateBounty from '../../utils/formatDateBounty';

const { Option } = Select;

const ViewBountyModal = ({
  visible,
  bounty,
  onCancel,
  onUpdateSuccess,
  setSelectedBounty,
}) => {
  const handleSaveUpdate = async () => {
    try {
      await updateBounty({
        ...bounty,
        deadline: bounty.deadline
          ? new Date(bounty.deadline._seconds * 1000).toISOString() // TODO: Handle date conversion properly.
          : null,
      });
      toast.success('Bounty updated successfully');
      onUpdateSuccess();
      onCancel();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update bounty');
    }
  };

  const handleUnassign = async () => {
    try {
      await unassignContributor(bounty.id);
      toast.success('Contributor unassigned and chat cleared');
      onUpdateSuccess();
    } catch {
      toast.error('Failed to unassign contributor');
    }
  };

  return (
    <Modal
      title={bounty?.name}
      open={visible}
      onCancel={onCancel}
      onOk={handleSaveUpdate}
      okText="Save Changes"
      width={600}
    >
      <p>
        <strong>Description:</strong> {bounty.description}
      </p>

      {bounty.github && bounty.issueLink && (
        <p>
          <a href={bounty.issueLink} target="_blank" rel="noopener noreferrer">
            <strong>Issue Link</strong>
          </a>
        </p>
      )}

      <p>
        <strong>Deadline:</strong>{' '}
        {bounty.deadline ? formatDateBounty(bounty.deadline) : '—'}
      </p>

      <Divider />
      <p>
        <strong>Amount & Status:</strong>
      </p>
      <Row gutter={12}>
        <Col xs={24} sm={12}>
          <InputNumber
            min={0}
            value={bounty.amount}
            onChange={(val) =>
              setSelectedBounty({ ...bounty, amount: Number(val) })
            }
            style={{ width: '100%' }}
            prefix="$"
            placeholder="Amount"
          />
        </Col>
        <Col xs={24} sm={12}>
          <Select
            value={bounty.status}
            onChange={(val) => setSelectedBounty({ ...bounty, status: val })}
            style={{ width: '100%' }}
          >
            <Option value="open">Open</Option>
            <Option value="assigned">Assigned</Option>
            <Option value="pending_payment">Pending Payment</Option>
            <Option value="closed">Closed</Option>
          </Select>
        </Col>
      </Row>

      {bounty.contributorId && (
        <>
          <Divider />
          <p>
            <strong>Contributor:</strong>{' '}
            {bounty.contributorInfo?.linkedin ? (
              <a
                href={bounty.contributorInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#69b1ff', fontWeight: 'bold' }}
              >
                {bounty.contributorInfo.name || 'View Profile'}
              </a>
            ) : (
              bounty.contributorId
            )}
          </p>
          <p>
            <strong>Work Link:</strong>{' '}
            {bounty.submittedLink || 'Not submitted yet'}
          </p>
          <Divider />
          {/* <Button
            type="primary"
            onClick={handleSendPayment}
            block
            style={{ marginBottom: 10 }}
          >
            Send Payment
          </Button> */}
          <Button danger onClick={handleUnassign} block>
            Unassign Contributor
          </Button>
        </>
      )}
    </Modal>
  );
};

export default ViewBountyModal;
