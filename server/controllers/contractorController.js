const ContractorService = require('../services/ContractorService');
const ResponseHelper = require('../utils/ResponseHelper');

class ContractorController {
  async applyToContract(req, res) {
    try {
      const { contractId, userId } = req.body;
      await ContractorService.applyToContract(contractId, userId);
      return ResponseHelper.success(res, 'Applied successfully');
    } catch (err) {
      console.error('Apply to Contract Error:', err.message);
      return ResponseHelper.error(res, 'Application failed');
    }
  }

  async submitWork(req, res) {
    try {
      const { contractId, submittedLink } = req.body;
      await ContractorService.submitWork(contractId, submittedLink);
      return ResponseHelper.success(res, 'Work submitted');
    } catch (err) {
      console.error('Submit Work Error:', err.message);
      return ResponseHelper.error(res, 'Submission failed');
    }
  }

  async fetchContracts(req, res) {
    try {
      const contracts = await ContractorService.fetchContracts(req.params.uid);
      return ResponseHelper.success(res, 'Contracts fetched', { contracts });
    } catch (err) {
      console.error('Fetch Contracts Error:', err.message);
      return ResponseHelper.error(res, 'Fetch failed');
    }
  }

  async getProfile(req, res) {
    try {
      const profile = await ContractorService.getProfile(req.params.uid);
      if (profile) {
        return ResponseHelper.success(res, 'Profile fetched', { profile });
      }
      return ResponseHelper.error(res, 'Profile not found', 404);
    } catch (err) {
      console.error('Get Profile Error:', err.message);
      return ResponseHelper.error(res, 'Failed to fetch profile');
    }
  }

  async saveProfile(req, res) {
    try {
      await ContractorService.saveProfile(req.params.uid, req.body);
      return ResponseHelper.success(res, 'Profile saved');
    } catch (err) {
      console.error('Save Profile Error:', err.message);
      return ResponseHelper.error(res, 'Error saving profile');
    }
  }

  async unassignSelf(req, res) {
    const { contractId } = req.body;

    if (!contractId) {
      return ResponseHelper.error(res, 'Contract ID is required', 400);
    }

    try {
      await ContractorService.unassignSelf(contractId);
      return ResponseHelper.success(res, 'Contractor unassigned');
    } catch (err) {
      console.error('Unassign Self Error:', err.message);
      return ResponseHelper.error(res, 'Failed to unassign contractor');
    }
  }

  async getContractorPayments(req, res) {
    try {
      const payments = await ContractorService.getContractorPayments(
        req.params.uid
      );
      return ResponseHelper.success(res, 'Payments fetched', { payments });
    } catch (err) {
      console.error('Get Contractor Payments Error:', err.message);
      return ResponseHelper.error(res, 'Failed to fetch payments');
    }
  }
}

module.exports = new ContractorController();
