const express = require('express');
const router = express.Router();
const {
  createContract,
  deleteContract,
  getContractor,
  getContracts,
  getProfile,
  saveProfile,
  updateContract,
  updateContractor,
  unassignContractor,
  getBusinessPayments,
} = require('../controllers/businessController');

router.post('/contract', createContract);
router.delete('/contract/:id', deleteContract);
router.put('/contract/:id', updateContract);
router.get('/contracts/:uid', getContracts);

router.get('/contractor/:id', getContractor);
router.put('/contractor/:id', updateContractor);
router.put('/contracts/:contractId/unassign', unassignContractor);

router.get('/profile/:uid', getProfile);
router.put('/profile/:uid', saveProfile);

router.get('/payments/:uid', getBusinessPayments);

module.exports = router;
