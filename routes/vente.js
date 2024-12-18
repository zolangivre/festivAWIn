const express = require('express');
const router = express.Router();
const venteController = require('../controllers/vente');

router.post('/', venteController.createVente);

module.exports = router;