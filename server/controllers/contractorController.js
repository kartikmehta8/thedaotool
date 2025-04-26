const FirestoreService = require('../services/FirestoreService');
const RealtimeDatabaseService = require('../services/RealtimeDatabaseService');
const triggerEmail = require('../utils/triggerEmail');

class ContractorController {
  async applyToContract(req, res) {
    try {
      const { contractId, userId } = req.body;

      await FirestoreService.updateDocument('contracts', contractId, {
        status: 'assigned',
        contractorId: userId,
      });

      await triggerEmail('contractAssignedToBusiness', contractId, {
        contractorId: userId,
      });

      res.status(200).json({ message: 'Applied successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Application failed' });
    }
  }

  async submitWork(req, res) {
    try {
      const { contractId, submittedLink } = req.body;

      await FirestoreService.updateDocument('contracts', contractId, {
        status: 'pending_payment',
        submittedLink,
      });

      await triggerEmail('submissionNotificationToBusiness', contractId, {
        submittedLink,
      });

      res.status(200).json({ message: 'Work submitted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Submission failed' });
    }
  }

  async fetchContracts(req, res) {
    try {
      const uid = req.params.uid;
      const contractList = await FirestoreService.queryDocuments(
        'contracts',
        'status',
        '!=',
        'closed'
      );

      const allContracts = await Promise.all(
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

      const filtered = allContracts.filter(
        (c) => c.status === 'open' || c.contractorId === uid
      );

      res.status(200).json({ contracts: filtered });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Fetch failed' });
    }
  }

  async getProfile(req, res) {
    try {
      const contractorProfile = await FirestoreService.getDocument(
        'contractors',
        req.params.uid
      );

      if (contractorProfile) return res.json(contractorProfile);
      res.status(404).json({ message: 'Profile not found' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch profile' });
    }
  }

  async saveProfile(req, res) {
    try {
      const { uid } = req.params;
      await FirestoreService.setDocument('contractors', uid, req.body);
      res.status(200).json({ message: 'Profile saved' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error saving profile' });
    }
  }

  async unassignSelf(req, res) {
    const { contractId } = req.body;

    if (!contractId) {
      return res.status(400).json({ error: 'Contract ID is required' });
    }

    try {
      await FirestoreService.updateDocument('contracts', contractId, {
        contractorId: null,
        status: 'open',
        submittedLink: '',
      });

      await RealtimeDatabaseService.removeData(`chats/${contractId}`);

      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('Unassign self failed:', err.message);
      return res.status(500).json({ error: 'Failed to unassign contractor' });
    }
  }

  async getContractorPayments(req, res) {
    const { uid } = req.params;

    try {
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

      res.json({ payments });
    } catch (err) {
      console.error('Error fetching contractor payments:', err.message);
      res.status(500).json({ error: 'Failed to fetch payments' });
    }
  }
}

module.exports = new ContractorController();
