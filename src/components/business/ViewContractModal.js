import React from 'react';
import { Modal, Divider, Select, Button } from 'antd';
import {
  updateContract,
  getContractorData,
  updateContractorData,
} from '../../api/firebaseBusiness';
import { createPayee, sendPayment } from '../../api/payman';
import toast from '../../utils/toast';

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

  return (
    <Modal
      title={contract?.name}
      open={visible}
      onCancel={onCancel}
      onOk={handleSaveUpdate}
      okText="Save Changes"
    >
      <p>
        <strong>Description:</strong> {contract.description}
      </p>
      <p>
        <strong>Deadline:</strong> {contract.deadline}
      </p>
      <p>
        <strong>Amount:</strong> ${contract.amount}
      </p>
      <Divider />
      <p>
        <strong>Status:</strong>
      </p>
      <Select
        value={contract.status}
        onChange={(val) => setSelectedContract({ ...contract, status: val })}
        style={{ width: '100%' }}
      >
        <Option value="open">Open</Option>
        <Option value="assigned">Assigned</Option>
        <Option value="pending_payment">Pending Payment</Option>
        <Option value="closed">Closed</Option>
      </Select>
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
          <Button type="primary" onClick={handleSendPayment} block>
            Send Payment
          </Button>
        </>
      )}
    </Modal>
  );
};

export default ViewContractModal;
