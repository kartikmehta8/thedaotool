const FirestoreService = require('./FirestoreService');
const RealtimeDatabaseService = require('./RealtimeDatabaseService');
const triggerEmail = require('../utils/triggerEmail');

class ContractorService {
  async applyToContract(contractId, userId) {
    await FirestoreService.updateDocument('contracts', contractId, {
      status: 'assigned',
      contractorId: userId,
    });

    await triggerEmail('contractAssignedToBusiness', contractId, {
      contractorId: userId,
    });
  }

  async submitWork(contractId, submittedLink) {
    await FirestoreService.updateDocument('contracts', contractId, {
      status: 'pending_payment',
      submittedLink,
    });

    await triggerEmail('submissionNotificationToBusiness', contractId, {
      submittedLink,
    });
  }

  async fetchContracts(uid) {
    const contractList = await FirestoreService.queryDocuments(
      'contracts',
      'status',
      '!=',
      'closed'
    );

    const contracts = await Promise.all(
      contractList.map(async (contract) => {
        const businessInfo = await FirestoreService.getDocument(
          'businesses',
          contract.businessId
        );

        return {
          id: contract.id,
          ...contract,
          businessInfo: businessInfo || {},
        };
      })
    );

    return contracts.filter(
      (c) => c.status === 'open' || c.contractorId === uid
    );
  }

  async getProfile(uid) {
    return FirestoreService.getDocument('contractors', uid);
  }

  async saveProfile(uid, profileData) {
    return FirestoreService.setDocument('contractors', uid, profileData);
  }

  async unassignSelf(contractId) {
    await FirestoreService.updateDocument('contracts', contractId, {
      contractorId: null,
      status: 'open',
      submittedLink: '',
    });

    await RealtimeDatabaseService.removeData(`chats/${contractId}`);
  }

  async getContractorPayments(uid) {
    const contractList = await FirestoreService.queryDocuments(
      'contracts',
      'contractorId',
      '==',
      uid
    );

    const filteredContracts = contractList.filter((contract) =>
      ['closed', 'pending_payment'].includes(contract.status)
    );

    const payments = await Promise.all(
      filteredContracts.map(async (contract) => {
        let businessName = 'Unknown Business';

        if (contract.businessId) {
          try {
            const businessInfo = await FirestoreService.getDocument(
              'businesses',
              contract.businessId
            );
            if (businessInfo) {
              businessName = businessInfo.companyName || businessName;
            }
          } catch (err) {
            console.warn(
              `Failed to fetch business (${contract.businessId})`,
              err.message
            );
          }
        }

        return {
          id: contract.id,
          businessName,
          contractTitle: contract.name || 'Untitled',
          amount: contract.amount || 0,
          date: contract.updatedAt || contract.createdAt || '',
          status: contract.status === 'closed' ? 'Success' : 'Pending',
        };
      })
    );

    payments.sort((a, b) => new Date(b.date) - new Date(a.date));

    return payments;
  }
}

module.exports = new ContractorService();
