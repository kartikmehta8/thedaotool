const express = require('express');
const {
  applyToContract,
  fetchContracts,
  getProfile,
  saveProfile,
  submitWork,
  unassignSelf,
  getContractorPayments,
} = require('../../controllers/contractorController');
const IRoute = require('../IRoute');

class ContractorRoutes extends IRoute {
  register(app) {
    const router = express.Router();

    router.post('/apply', applyToContract);
    router.post('/submit', submitWork);
    router.get('/contracts/:uid', fetchContracts);
    router.get('/profile/:uid', getProfile);
    router.put('/profile/:uid', saveProfile);
    router.put('/unassign', unassignSelf);

    router.get('/payments/:uid', getContractorPayments);

    app.use('/api/contractor', router);
  }
}

module.exports = ContractorRoutes;
