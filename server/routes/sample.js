const express = require('express');
const { sampleFunction } = require('../controllers/sampleController');

const router = express.Router();

router.get('/', sampleFunction);

module.exports = router;
