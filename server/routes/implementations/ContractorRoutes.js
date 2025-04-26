const express = require('express');
const ContractorController = require('../../controllers/contractorController');
const IRoute = require('../IRoute');

class ContractorRoutes extends IRoute {
  register(app) {
    const router = express.Router();

    router.post('/apply', ContractorController.applyToContract);
    router.post('/submit', ContractorController.submitWork);
    router.get('/contracts/:uid', ContractorController.fetchContracts);
    router.get('/profile/:uid', ContractorController.getProfile);
    router.put('/profile/:uid', ContractorController.saveProfile);
    router.put('/unassign', ContractorController.unassignSelf);

    router.get('/payments/:uid', ContractorController.getContractorPayments);

    app.use('/api/contractor', router);
  }
}

module.exports = ContractorRoutes;
