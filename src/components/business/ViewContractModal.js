import React from 'react';
import { Modal, Divider, Select, Button } from 'antd';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../providers/firebase';
import toast from '../../utils/toast';
import Paymanai from 'paymanai';

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
    try {
      await updateDoc(doc(db, 'contracts', contract.id), contract);
      toast.success('Contract updated');
      onCancel();
      onUpdateSuccess();
    } catch (err) {
      toast.error('Error saving changes');
    }
  };

  const handlePayeeSetup = async () => {
    if (!contract?.contractorInfo || !apiKey) return;
    try {
      const payman = new Paymanai({ xPaymanAPISecret: apiKey });
      const { name, email, accountNumber, routingNumber } =
        contract.contractorInfo;

      const contractorRef = doc(db, 'contractors', contract.contractorId);
      const contractorSnap = await getDoc(contractorRef);

      if (contractorSnap.exists()) {
        const contractorData = contractorSnap.data();

        if (contractorData.payeeId) {
          toast.warning('Payee already exists for this contractor.');
          return;
        }

        const payee = await payman.payments.createPayee({
          type: 'US_ACH',
          name,
          accountHolderName: name,
          accountHolderType: 'individual',
          accountNumber,
          routingNumber,
          accountType: 'checking',
          contactDetails: { email },
        });

        await updateDoc(contractorRef, { payeeId: payee.id });
        toast.success(`Payee created and saved for ${name}`);
      }
    } catch (err) {
      toast.error('Failed to create payee');
    }
  };

  const handleSendPayment = async () => {
    if (!contract?.contractorInfo || !apiKey) return;
    try {
      const contractorSnap = await getDoc(
        doc(db, 'contractors', contract.contractorId)
      );

      if (!contractorSnap.exists()) {
        toast.error('Contractor profile not found');
        return;
      }

      const contractorData = contractorSnap.data();
      const payeeId = contractorData.payeeId;

      if (!payeeId) {
        toast.warning('No payee found. Please create payee first.');
        return;
      }

      const payman = new Paymanai({ xPaymanAPISecret: apiKey });
      await payman.payments.sendPayment({
        amountDecimal: Number(contract.amount),
        payeeId: process.env.REACT_APP_PAYMAN_TEST_PAYEE_ID, // payeeId, We need test payeeId as we are in test mode.
        memo: `Payment for ${contract.name}`,
        metadata: { contractId: contract.id },
      });

      toast.success('Payment sent successfully');
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
