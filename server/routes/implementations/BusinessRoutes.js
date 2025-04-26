const express = require('express');
const BusinessController = require('../../controllers/businessController');
const IRoute = require('../IRoute');

class BusinessRoutes extends IRoute {
  register(app) {
    const router = express.Router();

    router.post('/contract', BusinessController.createContract);
    router.delete('/contract/:id', BusinessController.deleteContract);
    router.put('/contract/:id', BusinessController.updateContract);
    router.get('/contracts/:uid', BusinessController.getContracts);

    router.get('/contractor/:id', BusinessController.getContractor);
    router.put('/contractor/:id', BusinessController.updateContractor);
    router.put(
      '/contracts/:contractId/unassign',
      BusinessController.unassignContractor
    );

    router.get('/profile/:uid', BusinessController.getProfile);
    router.put('/profile/:uid', BusinessController.saveProfile);

    router.get('/payments/:uid', BusinessController.getBusinessPayments);

    app.use('/api/business', router);
  }
}

module.exports = BusinessRoutes;
