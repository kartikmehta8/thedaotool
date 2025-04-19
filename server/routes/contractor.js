const express = require('express');
const router = express.Router();
const {
  applyToContract,
  fetchContracts,
  getProfile,
  saveProfile,
  submitWork,
  unassignSelf,
} = require('../controllers/contractorController');

router.post('/apply', applyToContract);
router.post('/submit', submitWork);
router.get('/contracts/:uid', fetchContracts);
router.get('/profile/:uid', getProfile);
router.put('/profile/:uid', saveProfile);
router.put('/unassign', unassignSelf);

module.exports = router;
