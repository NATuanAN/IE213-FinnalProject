const express = require('express');
const router = express.Router();
const openaiController = require('../controllers/gpt.controller');
router.post('/gpt', openaiController.handleGPTRequest);

module.exports = router;