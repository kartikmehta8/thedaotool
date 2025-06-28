const FirestoreService = require('@services/database/FirestoreService');
const RealtimeDatabaseService = require('@services/database/RealtimeDatabaseService');
const postToDiscord = require('@utils/postToDiscord');
const CacheService = require('@services/misc/CacheService');
const EmailService = require('@services/misc/EmailService');
const PrivyService = require('@services/integrations/PrivyService');

class OrganizationService {
  async createBounty(values, userId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(values.deadline);
    if (deadlineDate <= today) {
      const err = new Error('Deadline cannot be in the past');
      err.status = 400;
      throw err;
    }
    const bounty = {
      name: values.name || '',
      description: values.description || '',
      deadline: values.deadline || '',
      amount: Number(values.amount || 0),
      organizationId: userId,
      contributorId: null,
      status: 'open',
      submittedLink: '',
      createdAt: new Date().toISOString(),
      tags: values.tags ? values.tags.split(',') : [],
    };

    await FirestoreService.addDocument('bounties', bounty);
    await CacheService.del('GET:*bounties*');
    await postToDiscord(bounty);
    return bounty;
  }

  async deleteBounty(bountyId) {
    const res = await FirestoreService.deleteDocument('bounties', bountyId);
    await CacheService.del('GET:*bounties*');
    await CacheService.del('GET:*payments*');
    return res;
  }

  async updateBounty(bountyId, updateData) {
    if (updateData.deadline) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const deadlineDate = new Date(updateData.deadline);
      if (deadlineDate <= today) {
        const err = new Error('Deadline cannot be in the past');
        err.status = 400;
        throw err;
      }
    }
    const res = await FirestoreService.updateDocument(
      'bounties',
      bountyId,
      updateData
    );
    await CacheService.del('GET:*bounties*');
    await CacheService.del('GET:*payments*');
    return res;
  }

  async getBounties(organizationId) {
    const bountyList = await FirestoreService.queryDocuments(
      'bounties',
      'organizationId',
      '==',
      organizationId
    );

    const bounties = await Promise.all(
      bountyList.map(async (bounty) => {
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

        return { ...bounty, contributorInfo };
      })
    );

    return bounties;
  }

  async getContributor(contributorId) {
    return FirestoreService.getDocument('contributors', contributorId);
  }

  async updateContributor(contributorId, updateData) {
    const res = await FirestoreService.updateDocument(
      'contributors',
      contributorId,
      updateData
    );
    await CacheService.del(
      `GET:/api/organization/contributor/${contributorId}`
    );
    await CacheService.del(`GET:/api/contributor/profile/${contributorId}`);
    return res;
  }

  async getProfile(organizationId) {
    return FirestoreService.getDocument('organizations', organizationId);
  }

  async saveProfile(organizationId, profileData) {
    const res = await FirestoreService.setDocument(
      'organizations',
      organizationId,
      profileData
    );
    await CacheService.del(`GET:/api/organization/profile/${organizationId}`);
    await CacheService.del('GET:*bounties*');
    return res;
  }

  async unassignContributor(bountyId) {
    await FirestoreService.updateDocument('bounties', bountyId, {
      contributorId: null,
      status: 'open',
      submittedLink: '',
    });

    await RealtimeDatabaseService.removeData(`chats/${bountyId}`);
    await CacheService.del('GET:*bounties*');
    await CacheService.del('GET:*payments*');
  }

  async payBounty(bountyId, organizationId) {
    const bounty = await FirestoreService.getDocument('bounties', bountyId);
    if (!bounty) throw new Error('Bounty not found');
    if (bounty.organizationId !== organizationId)
      throw new Error('Unauthorized');
    if (bounty.status !== 'pending_payment')
      throw new Error('Bounty not ready for payment');

    const orgUser = await FirestoreService.getDocument('users', organizationId);
    const contributorUser = await FirestoreService.getDocument(
      'users',
      bounty.contributorId
    );

    if (!orgUser?.walletId || !orgUser?.walletAddress)
      throw new Error('Organization wallet missing');
    if (!contributorUser?.walletAddress)
      throw new Error('Contributor wallet missing');

    const lamports = Math.round(Number(bounty.amount) * 1e9);
    const txHash = await PrivyService.sendSol(
      orgUser.walletId,
      orgUser.walletAddress,
      contributorUser.walletAddress,
      lamports
    );

    await FirestoreService.updateDocument('bounties', bountyId, {
      status: 'paid',
      updatedAt: new Date().toISOString(),
      txHash,
    });

    await CacheService.del('GET:*bounties*');
    await CacheService.del('GET:*payments*');

    await EmailService.sendPaymentSentToContributor({
      bountyId,
      amount: bounty.amount,
    });

    return txHash;
  }

  async getOrganizationPayments(organizationId) {
    const bountyList = await FirestoreService.queryDocuments(
      'bounties',
      'organizationId',
      '==',
      organizationId
    );

    return bountyList
      .filter((bounty) => ['paid', 'pending_payment'].includes(bounty.status))
      .map((bounty) => ({
        id: bounty.id,
        contributor:
          bounty.contributorInfo?.name ||
          bounty.contributorInfo?.email ||
          'N/A',
        bountyTitle: bounty.name || 'Untitled',
        amount: bounty.amount || 0,
        date: bounty.updatedAt || bounty.createdAt || '',
        status: bounty.status,
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }
}

module.exports = new OrganizationService();
