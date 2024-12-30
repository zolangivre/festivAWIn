const express = require('express');
const router = express.Router();
const venteJeuController = require('../controllers/vente_jeu');

router.get('/:idVente', venteJeuController.getJeuxVendusByVenteId);

module.exports = router;
