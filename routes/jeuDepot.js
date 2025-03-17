const express = require('express');
const router = express.Router();
const jeuDepotController = require('../controllers/jeuDepot');

// Récupérer tous les jeux qui ne sont pas supprimés
router.get('/', jeuDepotController.getJeuxDepotPasSupprimés);

// Récupérer tous les jeux
router.get('/all', jeuDepotController.getJeuxDepot);

// Ajouter un jeu
router.post('/', jeuDepotController.createJeuDepot);

// Route pour obtenir les jeux d'un utilisateur
router.get('/user/:userId', jeuDepotController.getJeuxDepotByUserId);

// Route pour supprimer un jeu
router.delete('/:jeuId', jeuDepotController.deleteJeuDepot);

// Route pour supprimer tout les jeux d'un utilisateur
router.delete('/user/:userId', jeuDepotController.deleteAllJeuxDepotByUserId);

// Route pour modifier un jeu
router.put('/:jeuId', jeuDepotController.updateJeuDepot);

// Route pour obtenir un jeu par son id
// router.get('/:jeuId', jeuDepotController.getJeuDepotById);

module.exports = router;