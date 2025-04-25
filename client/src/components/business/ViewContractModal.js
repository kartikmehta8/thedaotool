import React from 'react';
import { Modal, Divider, Select, Button, InputNumber, Row, Col } from 'antd';
import {
  updateContract,
  getContractorData,
  updateContractorData,
  unassignContractor,
} from '../../api/firebaseBusiness';
import { createPayee, sendPayment } from '../../api/payman';
import toast from '../../utils/toast';
import formatDate from '../../utils/formatDate';

const { Option } = Select;

const ViewContractModal = ({
  visible,
  contract,
  apiKey,
  onCancel,
  onUpdateSuccess,
  setSelectedContract,
}) => {
  const handleSaveUpdate = async () => {
    await updateContract(contract, onUpdateSuccess, onCancel);
  };

  const handlePayeeSetup = async () => {
    if (!contract?.contractorInfo || !apiKey) return;
    try {
      const contractorData = await getContractorData(contract.contractorId);
      if (contractorData.payeeId) {
        toast.warning('Payee already exists for this contractor.');
        return;
      }
      await createPayee(
        contract.contractorInfo,
        apiKey,
        contract.contractorId,
        updateContractorData
      );
    } catch (err) {
      toast.error('Failed to create payee');
    }
  };

  const handleSendPayment = async () => {
    if (!contract?.contractorInfo || !apiKey) return;
    try {
      const contractorData = await getContractorData(contract.contractorId);
      const payeeId = contractorData?.payeeId || '';
      if (!payeeId) {
        toast.warning('No payee found. Please create payee first.');
        return;
      }
      await sendPayment(contract, payeeId, apiKey);
    } catch (err) {
      toast.error('Failed to send payment');
    }
  };

  const handleUnassign = async () => {
    try {
      await unassignContractor(contract.id, onUpdateSuccess);
      toast.success('Contractor unassigned and chat cleared.');
    } catch {
      toast.error('Failed to unassign contractor.');
    }
  };

  return (
    <Modal
      title={contract?.name}
      open={visible}
      onCancel={onCancel}
      onOk={handleSaveUpdate}
      okText="Save Changes"
      width={600}
    >
      <p>
        <strong>Description:</strong> {contract.description}
      </p>

      {contract.github && contract.issueLink && (
        <p>
          <a
            href={contract.issueLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong>Issue Link</strong>
          </a>
        </p>
      )}

      <p>
        <strong>Deadline:</strong> {formatDate(contract.deadline) || '—'}
      </p>

      <Divider />
      <p>
        <strong>Amount & Status:</strong>
      </p>
      <Row gutter={12}>
        <Col xs={24} sm={12}>
          <InputNumber
            min={0}
            value={contract.amount}
            onChange={(val) =>
              setSelectedContract({ ...contract, amount: Number(val) })
            }
            style={{ width: '100%' }}
            prefix="$"
            placeholder="Amount"
          />
        </Col>
        <Col xs={24} sm={12}>
          <Select
            value={contract.status}
            onChange={(val) =>
              setSelectedContract({ ...contract, status: val })
            }
            style={{ width: '100%' }}
          >
            <Option value="open">Open</Option>
            <Option value="assigned">Assigned</Option>
            <Option value="pending_payment">Pending Payment</Option>
            <Option value="closed">Closed</Option>
          </Select>
        </Col>
      </Row>

      {contract.contractorId && (
        <>
          <Divider />
          <p>
            <strong>Contractor:</strong>{' '}
            {contract.contractorInfo?.linkedin ? (
              <a
                href={contract.contractorInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#69b1ff', fontWeight: 'bold' }}
              >
                {contract.contractorInfo.name || 'View Profile'}
              </a>
            ) : (
              contract.contractorId
            )}
          </p>
          <p>
            <strong>Work Link:</strong>{' '}
            {contract.submittedLink || 'Not submitted yet'}
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
            Unassign Contractor
          </Button>
        </>
      )}
    </Modal>
  );
};

export default ViewContractModal;
