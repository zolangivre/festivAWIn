const express = require('express');
const router = express.Router();
const jeuDepotController = require('../controllers/jeuDepot');

// Route pour obtenir tous les jeux
router.get('/', jeuDepotController.getJeuxDepot);

// Route pour ajouter un jeu
router.post('/', jeuDepotController.createJeuDepot);

// Route pour filtrer les jeux
router.get('/filter', jeuDepotController.filterJeuxDepot);

module.exports = router;