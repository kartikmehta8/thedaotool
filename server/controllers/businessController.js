const BusinessService = require('../services/user/BusinessService');
const ResponseHelper = require('../utils/ResponseHelper');

class BusinessController {
  async createContract(req, res) {
    try {
      const { values, userId } = req.body;
      await BusinessService.createContract(values, userId);
      return ResponseHelper.success(res, 'Contract created');
    } catch (err) {
      return ResponseHelper.error(res, 'Creation failed');
    }
  }

  async deleteContract(req, res) {
    try {
      await BusinessService.deleteContract(req.params.id);
      return ResponseHelper.success(res, 'Deleted');
    } catch (err) {
      return ResponseHelper.error(res, 'Delete failed');
    }
  }

  async updateContract(req, res) {
    try {
      await BusinessService.updateContract(req.params.id, req.body);
      return ResponseHelper.success(res, 'Updated');
    } catch (err) {
      return ResponseHelper.error(res, 'Update failed');
    }
  }

  async getContracts(req, res) {
    try {
      const contracts = await BusinessService.getContracts(req.params.uid);
      return ResponseHelper.success(res, 'Contracts fetched', { contracts });
    } catch (err) {
      return ResponseHelper.error(res, 'Failed to fetch contracts');
    }
  }

  async getContractor(req, res) {
    try {
      const contractor = await BusinessService.getContractor(req.params.id);

      if (contractor) {
        return ResponseHelper.success(res, 'Contractor fetched', {
          contractor,
        });
      }
      return ResponseHelper.error(res, 'Contractor not found', 404);
    } catch (err) {
      return ResponseHelper.error(res, 'Error fetching contractor');
    }
  }

  async updateContractor(req, res) {
    try {
      await BusinessService.updateContractor(req.params.id, req.body);
      return ResponseHelper.success(res, 'Contractor updated');
    } catch (err) {
      return ResponseHelper.error(res, 'Error updating contractor');
    }
  }

  async getProfile(req, res) {
    try {
      const profile = await BusinessService.getProfile(req.params.uid);

      if (profile) {
        return ResponseHelper.success(res, 'Profile fetched', { profile });
      }
      return ResponseHelper.error(res, 'Profile not found', 404);
    } catch (err) {
      return ResponseHelper.error(res, 'Error fetching profile');
    }
  }

  async saveProfile(req, res) {
    try {
      await BusinessService.saveProfile(req.params.uid, req.body);
      return ResponseHelper.success(res, 'Profile saved');
    } catch (err) {
      return ResponseHelper.error(res, 'Error saving profile');
    }
  }

  async unassignContractor(req, res) {
    try {
      await BusinessService.unassignContractor(req.params.contractId);
      return ResponseHelper.success(res, 'Contractor unassigned');
    } catch (err) {
      return ResponseHelper.error(res, 'Failed to unassign contractor');
    }
  }

  async getBusinessPayments(req, res) {
    try {
      const payments = await BusinessService.getBusinessPayments(
        req.params.uid
      );
      return ResponseHelper.success(res, 'Payments fetched', { payments });
    } catch (err) {
      return ResponseHelper.error(res, 'Failed to fetch payments');
    }
  }
}

module.exports = new BusinessController();
