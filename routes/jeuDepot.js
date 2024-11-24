const express = require('express');
const router = express.Router();
const jeuDepotController = require('../controllers/jeuDepot');

// Route pour obtenir tous les jeux
router.get('/', jeuDepotController.getJeuxDepot);

// Route pour ajouter un jeu
router.post('/', jeuDepotController.createJeuDepot);

// Route pour filtrer les jeux
router.get('/filter', jeuDepotController.filterJeuxDepot);

// Route pour obtenir les jeux d'un utilisateur
router.get('/user/:userId', jeuDepotController.getJeuxDepotByUserId);

// Route pour supprimer un jeu
router.delete('/:jeuId', jeuDepotController.deleteJeuDepot);

// Route pour supprimer tout les jeux d'un utilisateur
router.delete('/user/:userId', jeuDepotController.deleteAllJeuxDepotByUserId);

// Route pour modifier un jeu
router.put('/:jeuId', jeuDepotController.updateJeuDepot);

// Route pour obtenir un jeu par son id
router.get('/:jeuId', jeuDepotController.getJeuDepotById);

module.exports = router;