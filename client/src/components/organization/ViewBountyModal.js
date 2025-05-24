import React from 'react';
import { Modal, Divider, Select, Button, InputNumber, Row, Col } from 'antd';
import {
  updateBounty,
  unassignContributor,
} from '../../api/organization/bounties';
import {
  getContributorData,
  updateContributorData,
} from '../../api/organization/profile';

import { createPayee, sendPayment } from '../../api/payman';
import toast from '../../utils/toast';
import formatDateBounty from '../../utils/formatDateBounty';

const { Option } = Select;

const ViewBountyModal = ({
  visible,
  bounty,
  apiKey,
  onCancel,
  onUpdateSuccess,
  setSelectedBounty,
}) => {
  const handleSaveUpdate = async () => {
    try {
      await updateBounty(bounty);
      toast.success('Bounty updated successfully');
      onUpdateSuccess();
      onCancel();
    } catch (err) {
      toast.error('Failed to update bounty');
    }
  };

  const handlePayeeSetup = async () => {
    if (!bounty?.contributorInfo || !apiKey) return;
    try {
      const contributorData = await getContributorData(bounty.contributorId);
      if (contributorData.payeeId) {
        toast.warning('Payee already exists for this contributor');
        return;
      }
      await createPayee(bounty.contributorInfo, apiKey, bounty.contributorId);
      await updateContributorData(bounty.contributorId, {
        payeeId: contributorData.payeeId,
      });
    } catch (err) {
      toast.error('Failed to create payee');
    }
  };

  const handleSendPayment = async () => {
    if (!bounty?.contributorInfo || !apiKey) return;
    try {
      const contributorData = await getContributorData(bounty.contributorId);
      const payeeId = contributorData?.payeeId || '';
      if (!payeeId) {
        toast.warning('Please create payee first');
        return;
      }
      await sendPayment(bounty, payeeId, apiKey);
      toast.success('Payment sent successfully');
    } catch (err) {
      toast.error('Failed to send payment');
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
        <strong>Deadline:</strong> {formatDateBounty(bounty.deadline) || '—'}
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
          <Button
            type="dashed"
            onClick={handlePayeeSetup}
            block
            style={{ marginBottom: 10 }}
          >
            Create Payee
          </Button>
          <Button
            type="primary"
            onClick={handleSendPayment}
            block
            style={{ marginBottom: 10 }}
          >
            Send Payment
          </Button>
          <Button danger onClick={handleUnassign} block>
            Unassign Contributor
          </Button>
        </>
      )}
    </Modal>
  );
};

export default ViewBountyModal;
