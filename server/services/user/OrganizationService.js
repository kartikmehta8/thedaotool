const FirestoreService = require('@services/database/FirestoreService');
const RealtimeDatabaseService = require('@services/database/RealtimeDatabaseService');
const postToDiscord = require('@utils/postToDiscord');
const CacheService = require('@services/misc/CacheService');
const PrivyService = require('@services/integrations/PrivyService');
const EncryptionService = require('@services/misc/EncryptionService');

class OrganizationService {
  async createBounty(values, userId) {
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
    const res = await FirestoreService.setDocument(
      'organizations',
      organizationId,
      profileData
    );
    await CacheService.del(`GET:/api/organization/profile/${organizationId}`);
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
  async payContributor(bountyId, organizationId) {
    const bounty = await FirestoreService.getDocument('bounties', bountyId);
    if (!bounty) throw new Error('Bounty not found');
    if (bounty.status !== 'pending_payment')
      throw new Error('Not ready for payment');
    const org = await FirestoreService.getDocument(
      'organizations',
      organizationId
    );
    if (!org) throw new Error('Organization not found');
    let orgPk = org.walletPrivateKey
      ? EncryptionService.decrypt(org.walletPrivateKey)
      : null;
    let orgAddress = org.walletAddress;
    if (!orgPk || !orgAddress) {
      const wallet = PrivyService.createWallet();
      orgPk = wallet.privateKey;
      orgAddress = wallet.address;
      await FirestoreService.updateDocument('organizations', organizationId, {
        walletAddress: orgAddress,
        walletPrivateKey: EncryptionService.encrypt(orgPk),
      });
    }
    const contributor = await FirestoreService.getDocument(
      'contributors',
      bounty.contributorId
    );
    if (!contributor) throw new Error('Contributor not found');
    let contribPk = contributor.walletPrivateKey
      ? EncryptionService.decrypt(contributor.walletPrivateKey)
      : null;
    let contribAddress = contributor.walletAddress;
    if (!contribPk || !contribAddress) {
      const w = PrivyService.createWallet();
      contribPk = w.privateKey;
      contribAddress = w.address;
      await FirestoreService.updateDocument(
        'contributors',
        bounty.contributorId,
        {
          walletAddress: contribAddress,
          walletPrivateKey: EncryptionService.encrypt(contribPk),
        }
      );
    }
    await PrivyService.sendPayment(orgPk, contribAddress, bounty.amount);
    await FirestoreService.updateDocument('bounties', bountyId, {
      status: 'closed',
      updatedAt: new Date().toISOString(),
    });
    await CacheService.del('GET:*payments*');
    return true;
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
        status: bounty.status,
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }
}

module.exports = new OrganizationService();
