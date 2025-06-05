const FirestoreService = require('../database/FirestoreService');
const RealtimeDatabaseService = require('../database/RealtimeDatabaseService');
const EmailService = require('../misc/EmailService');

class ContributorService {
  async applyToBounty(bountyId, userId) {
    await FirestoreService.updateDocument('bounties', bountyId, {
      status: 'assigned',
      contributorId: userId,
    });

    await EmailService.sendBountyAssignedToOrganization({
      bountyId,
      contributorId: userId,
    });
  }

  async submitWork(bountyId, submittedLink) {
    await FirestoreService.updateDocument('bounties', bountyId, {
      status: 'pending_payment',
      submittedLink,
    });

    await EmailService.sendSubmissionNotificationToOrganization({
      bountyId,
      submittedLink,
    });
  }

  async fetchBounties(uid) {
    const bountyList = await FirestoreService.queryDocuments(
      'bounties',
      'status',
      '!=',
      'closed'
    );

    const bounties = await Promise.all(
      bountyList.map(async (bounty) => {
        const organizationInfo = await FirestoreService.getDocument(
          'organizations',
          bounty.organizationId
        );

        return {
          id: bounty.id,
          ...bounty,
          organizationInfo: organizationInfo || {},
        };
      })
    );

    return bounties.filter(
      (c) => c.status === 'open' || c.contributorId === uid
    );
  }

  async getProfile(uid) {
    return FirestoreService.getDocument('contributors', uid);
  }

  async saveProfile(uid, profileData) {
    return FirestoreService.setDocument('contributors', uid, profileData);
  }

  async unassignSelf(bountyId) {
    await FirestoreService.updateDocument('bounties', bountyId, {
      contributorId: null,
      status: 'open',
      submittedLink: '',
    });

    await RealtimeDatabaseService.removeData(`chats/${bountyId}`);
  }

  async getContributorPayments(uid) {
    const bountyList = await FirestoreService.queryDocuments(
      'bounties',
      'contributorId',
      '==',
      uid
    );

    const filteredBounties = bountyList.filter((bounty) =>
      ['closed', 'pending_payment'].includes(bounty.status)
    );

    const payments = await Promise.all(
      filteredBounties.map(async (bounty) => {
        let organizationName = 'Unknown Organization';

        if (bounty.organizationId) {
          try {
            const organizationInfo = await FirestoreService.getDocument(
              'organizations',
              bounty.organizationId
            );
            if (organizationInfo) {
              organizationName =
                organizationInfo.companyName || organizationName;
            }
          } catch (err) {
            console.warn(
              `Failed to fetch organization (${bounty.organizationId})`,
              err.message
            );
          }
        }

        return {
          id: bounty.id,
          organizationName,
          bountyTitle: bounty.name || 'Untitled',
          amount: bounty.amount || 0,
          date: bounty.updatedAt || bounty.createdAt || '',
          status: bounty.status === 'closed' ? 'Success' : 'Pending',
        };
      })
    );

    payments.sort((a, b) => new Date(b.date) - new Date(a.date));

    return payments;
  }
}

module.exports = new ContributorService();
