const FirestoreService = require('../database/FirestoreService');
const RealtimeDatabaseService = require('../database/RealtimeDatabaseService');
const postToDiscord = require('../../utils/postToDiscord');

class OrganizationService {
  async createBounty(values, userId) {
    const bounty = {
      name: values.name || '',
      description: values.description || '',
      deadline: values.deadline ? values.deadline.toISOString() : '',
      amount: Number(values.amount || 0),
      organizationId: userId,
      contributorId: null,
      status: 'open',
      submittedLink: '',
      createdAt: new Date().toISOString(),
      tags: values.tags ? values.tags.split(',') : [],
    };

    await FirestoreService.addDocument('bounties', bounty);
    await postToDiscord(bounty);
    return bounty;
  }

  async deleteBounty(bountyId) {
    return FirestoreService.deleteDocument('bounties', bountyId);
  }

  async updateBounty(bountyId, updateData) {
    return FirestoreService.updateDocument('bounties', bountyId, updateData);
  }

  async getBounties(organizationId) {
    const bounties = [];
    const bountyList = await FirestoreService.queryDocuments(
      'bounties',
      'organizationId',
      '==',
      organizationId
    );

    for (const bounty of bountyList) {
      let contributorInfo = null;

      if (bounty.contributorId) {
        const contributor = await FirestoreService.getDocument(
          'contributors',
          bounty.contributorId
        );
        if (contributor) {
          contributorInfo = { id: bounty.contributorId, ...contributor };
        }
      }

      bounties.push({ ...bounty, contributorInfo });
    }

    return bounties;
  }

  async getContributor(contributorId) {
    return FirestoreService.getDocument('contributors', contributorId);
  }

  async updateContributor(contributorId, updateData) {
    return FirestoreService.updateDocument(
      'contributors',
      contributorId,
      updateData
    );
  }

  async getProfile(organizationId) {
    return FirestoreService.getDocument('organizations', organizationId);
  }

  async saveProfile(organizationId, profileData) {
    return FirestoreService.setDocument(
      'organizations',
      organizationId,
      profileData
    );
  }

  async unassignContributor(bountyId) {
    await FirestoreService.updateDocument('bounties', bountyId, {
      contributorId: null,
      status: 'open',
      submittedLink: '',
    });

    await RealtimeDatabaseService.removeData(`chats/${bountyId}`);
  }

  async getOrganizationPayments(organizationId) {
    const bountyList = await FirestoreService.queryDocuments(
      'bounties',
      'organizationId',
      '==',
      organizationId
    );

    return bountyList
      .filter((bounty) => ['closed', 'pending_payment'].includes(bounty.status))
      .map((bounty) => ({
        id: bounty.id,
        contributor:
          bounty.contributorInfo?.name ||
          bounty.contributorInfo?.email ||
          'N/A',
        bountyTitle: bounty.name || 'Untitled',
        amount: bounty.amount || 0,
        date: bounty.updatedAt || bounty.createdAt || '',
        status: bounty.status === 'closed' ? 'Success' : 'Pending',
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }
}

module.exports = new OrganizationService();
