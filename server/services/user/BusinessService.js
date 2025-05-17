const FirestoreService = require('../database/FirestoreService');
const RealtimeDatabaseService = require('../database/RealtimeDatabaseService');
const postToDiscord = require('../../utils/postToDiscord');

class BusinessService {
  async createContract(values, userId) {
    const contract = {
      name: values.name || '',
      description: values.description || '',
      deadline: values.deadline || '',
      amount: Number(values.amount || 0),
      businessId: userId,
      contractorId: null,
      status: 'open',
      submittedLink: '',
      createdAt: new Date().toISOString(),
      tags: values.tags ? values.tags.split(',') : [],
    };

    await FirestoreService.addDocument('contracts', contract);
    await postToDiscord(contract);
    return contract;
  }

  async deleteContract(contractId) {
    return FirestoreService.deleteDocument('contracts', contractId);
  }

  async updateContract(contractId, updateData) {
    return FirestoreService.updateDocument('contracts', contractId, updateData);
  }

  async getContracts(businessId) {
    const contracts = [];
    const contractList = await FirestoreService.queryDocuments(
      'contracts',
      'businessId',
      '==',
      businessId
    );

    for (const contract of contractList) {
      let contractorInfo = null;

      if (contract.contractorId) {
        const contractor = await FirestoreService.getDocument(
          'contractors',
          contract.contractorId
        );
        if (contractor) {
          contractorInfo = { id: contract.contractorId, ...contractor };
        }
      }

      contracts.push({ ...contract, contractorInfo });
    }

    return contracts;
  }

  async getContractor(contractorId) {
    return FirestoreService.getDocument('contractors', contractorId);
  }

  async updateContractor(contractorId, updateData) {
    return FirestoreService.updateDocument(
      'contractors',
      contractorId,
      updateData
    );
  }

  async getProfile(businessId) {
    return FirestoreService.getDocument('businesses', businessId);
  }

  async saveProfile(businessId, profileData) {
    return FirestoreService.setDocument('businesses', businessId, profileData);
  }

  async unassignContractor(contractId) {
    await FirestoreService.updateDocument('contracts', contractId, {
      contractorId: null,
      status: 'open',
      submittedLink: '',
    });

    await RealtimeDatabaseService.removeData(`chats/${contractId}`);
  }

  async getBusinessPayments(businessId) {
    const contractList = await FirestoreService.queryDocuments(
      'contracts',
      'businessId',
      '==',
      businessId
    );

    return contractList
      .filter((contract) =>
        ['closed', 'pending_payment'].includes(contract.status)
      )
      .map((contract) => ({
        id: contract.id,
        contractor:
          contract.contractorInfo?.name ||
          contract.contractorInfo?.email ||
          'N/A',
        contractTitle: contract.name || 'Untitled',
        amount: contract.amount || 0,
        date: contract.updatedAt || contract.createdAt || '',
        status: contract.status === 'closed' ? 'Success' : 'Pending',
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }
}

module.exports = new BusinessService();
