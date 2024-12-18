const express = require('express');
const router = express.Router();
const jeuDepotController = require('../controllers/jeuDepot');

router.get('/', jeuDepotController.getJeuxDepot);
router.post('/', jeuDepotController.createJeuDepot);
router.put('/:id', jeuDepotController.updateJeuDepot);
router.get('/filter', jeuDepotController.filterJeuxDepot);

module.exports = router;