const express = require('express');
const BusinessController = require('../../controllers/businessController');
const AuthMiddleware = require('../../middlewares/implementations/AuthMiddleware');
const ValidationMiddleware = require('../../middlewares/implementations/ValidationMiddleware');
const IRoute = require('../IRoute');

const {
  createContractSchema,
  updateContractSchema,
  contractIdParamSchema,
  contractorIdParamSchema,
  updateContractorSchema,
  uidParamSchema,
  uidAndBodySchema,
} = require('../../validators/businessValidators');

class BusinessRoutes extends IRoute {
  register(app) {
    const router = express.Router();

    router.use(AuthMiddleware.authenticate(['business']));

    router.post(
      '/contract',
      ValidationMiddleware.use(createContractSchema),
      BusinessController.createContract
    );

    router.delete(
      '/contract/:id',
      ValidationMiddleware.use(contractorIdParamSchema),
      BusinessController.deleteContract
    );

    router.put(
      '/contract/:id',
      ValidationMiddleware.use(updateContractSchema),
      BusinessController.updateContract
    );

    router.get(
      '/contracts/:uid',
      ValidationMiddleware.use(uidParamSchema),
      BusinessController.getContracts
    );

    router.get(
      '/contractor/:id',
      ValidationMiddleware.use(contractorIdParamSchema),
      BusinessController.getContractor
    );

    router.put(
      '/contractor/:id',
      ValidationMiddleware.use(updateContractorSchema),
      BusinessController.updateContractor
    );

    router.put(
      '/contracts/:contractId/unassign',
      ValidationMiddleware.use(contractIdParamSchema),
      BusinessController.unassignContractor
    );

    router.get(
      '/profile/:uid',
      ValidationMiddleware.use(uidParamSchema),
      BusinessController.getProfile
    );

    router.put(
      '/profile/:uid',
      ValidationMiddleware.use(uidAndBodySchema),
      BusinessController.saveProfile
    );

    router.get(
      '/payments/:uid',
      ValidationMiddleware.use(uidParamSchema),
      BusinessController.getBusinessPayments
    );

    app.use('/api/business', router);
  }
}

module.exports = BusinessRoutes;
