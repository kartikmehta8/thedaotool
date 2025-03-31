import Paymanai from 'paymanai';
import toast from '../utils/toast';

export const createPayee = async (
  contractorInfo,
  apiKey,
  contractorId,
  updateContractorData
) => {
  try {
    const payman = new Paymanai({ xPaymanAPISecret: apiKey });
    const { name, email, accountNumber, routingNumber } = contractorInfo;

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

    await updateContractorData(contractorId, { payeeId: payee.id });
    toast.success(`Payee created and saved for ${name}`);
    return payee.id;
  } catch (err) {
    toast.error('Failed to create payee');
    throw err;
  }
};

export const sendPayment = async (contract, payeeId, apiKey) => {
  try {
    const payman = new Paymanai({ xPaymanAPISecret: apiKey });
    await payman.payments.sendPayment({
      amountDecimal: Number(contract.amount),
      payeeId: process.env.REACT_APP_PAYMAN_TEST_PAYEE_ID, // Test Payee ID.
      memo: `Payment for ${contract.name}`,
      metadata: { contractId: contract.id },
    });
    toast.success('Payment sent successfully');
  } catch (err) {
    toast.error('Failed to send payment');
    throw err;
  }
};
