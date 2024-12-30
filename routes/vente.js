const express = require('express');
const router = express.Router();
const venteController = require('../controllers/vente');

router.post('/', venteController.createVente);
router.get('/', venteController.getAllVentes);
router.get('/acheteur/:acheteurId', venteController.getVenteByAcheteurId);
router.get('/vendeur/:vendeurId', venteController.getVenteByVendeurId);

module.exports = router;