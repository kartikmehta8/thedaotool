const express = require('express');
const router = express.Router();
const controller = require('../controllers/businessController');

router.post('/contract', controller.createContract);
router.delete('/contract/:id', controller.deleteContract);
router.put('/contract/:id', controller.updateContract);
router.get('/contracts/:uid', controller.getContracts);

router.get('/contractor/:id', controller.getContractor);
router.put('/contractor/:id', controller.updateContractor);

router.get('/profile/:uid', controller.getProfile);
router.put('/profile/:uid', controller.saveProfile);

module.exports = router;
