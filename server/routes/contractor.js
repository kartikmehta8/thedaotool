const express = require('express');
const router = express.Router();
const controller = require('../controllers/contractorController');

router.post('/apply', controller.applyToContract);
router.post('/submit', controller.submitWork);
router.get('/contracts/:uid', controller.fetchContracts);
router.get('/profile/:uid', controller.getProfile);
router.put('/profile/:uid', controller.saveProfile);

module.exports = router;
