const FirestoreService = require('../services/FirestoreService');
const RealtimeDatabaseService = require('../services/RealtimeDatabaseService');
const postToDiscord = require('../utils/postToDiscord');

class BusinessController {
  async createContract(req, res) {
    try {
      const { values, userId } = req.body;
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

      res.status(200).json({ message: 'Contract created' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Creation failed' });
    }
  }

  async deleteContract(req, res) {
    try {
      await FirestoreService.deleteDocument('contracts', req.params.id);
      res.status(200).json({ message: 'Deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Delete failed' });
    }
  }

  async updateContract(req, res) {
    try {
      await FirestoreService.updateDocument(
        'contracts',
        req.params.id,
        req.body
      );
      res.status(200).json({ message: 'Updated' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Update failed' });
    }
  }

  async getContracts(req, res) {
    try {
      const contracts = [];
      const contractList = await FirestoreService.queryDocuments(
        'contracts',
        'businessId',
        '==',
        req.params.uid
      );

      for (const contract of contractList) {
        let contractorInfo = null;

        if (contract.contractorId) {
          const contractor = await FirestoreService.getDocument(
            'contractors',
            contract.contractorId
          );
          if (contractor) {
            contractorInfo = {
              id: contract.contractorId,
              ...contractor,
            };
          }
        }

        contracts.push({ ...contract, contractorInfo });
      }

      res.status(200).json({ contracts });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch contracts' });
    }
  }

  async getContractor(req, res) {
    try {
      const contractor = await FirestoreService.getDocument(
        'contractors',
        req.params.id
      );

      if (contractor) return res.json(contractor);
      res.status(404).json({ message: 'Not found' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching contractor' });
    }
  }

  async updateContractor(req, res) {
    try {
      await FirestoreService.updateDocument(
        'contractors',
        req.params.id,
        req.body
      );
      res.status(200).json({ message: 'Contractor updated' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error updating contractor' });
    }
  }

  async getProfile(req, res) {
    try {
      const profile = await FirestoreService.getDocument(
        'businesses',
        req.params.uid
      );

      if (profile) return res.json(profile);
      res.status(404).json({ message: 'Profile not found' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching profile' });
    }
  }

  async saveProfile(req, res) {
    try {
      await FirestoreService.setDocument(
        'businesses',
        req.params.uid,
        req.body
      );
      res.status(200).json({ message: 'Profile saved' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error saving profile' });
    }
  }

  async unassignContractor(req, res) {
    const { contractId } = req.params;

    try {
      await FirestoreService.updateDocument('contracts', contractId, {
        contractorId: null,
        status: 'open',
        submittedLink: '',
      });

      await RealtimeDatabaseService.removeData(`chats/${contractId}`);

      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('Unassign error:', err.message);
      return res.status(500).json({ error: 'Failed to unassign contractor' });
    }
  }

  async getBusinessPayments(req, res) {
    try {
      const contractList = await FirestoreService.queryDocuments(
        'contracts',
        'businessId',
        '==',
        req.params.uid
      );

      const payments = contractList
        .filter(
          (doc) => doc.status === 'closed' || doc.status === 'pending_payment'
        )
        .map((data) => ({
          id: data.id,
          contractor:
            data.contractorInfo?.name || data.contractorInfo?.email || 'N/A',
          contractTitle: data.name || 'Untitled',
          amount: data.amount || 0,
          date: data.updatedAt || data.createdAt || '',
          status: data.status === 'closed' ? 'Success' : 'Pending',
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      res.json({ payments });
    } catch (err) {
      console.error('Error reading payments from contracts:', err.message);
      res.status(500).json({ error: 'Failed to read contract-based payments' });
    }
  }
}

module.exports = new BusinessController();
