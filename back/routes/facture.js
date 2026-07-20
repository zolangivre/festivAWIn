const express = require('express');
const router = express.Router();
const factureController = require('../controllers/facture');

router.get('/telecharger/:venteId', factureController.telechargerFacture);

module.exports = router;