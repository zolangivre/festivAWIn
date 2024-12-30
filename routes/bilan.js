const express = require('express');
const router = express.Router();
const bilanController = require('../controllers/bilan');

// Routes admin
router.get('/', bilanController.getBilan);
router.get('/:id', bilanController.getBilanById);
router.post('/', bilanController.createBilan);
router.put('/:id', bilanController.updateBilan);
router.delete('/:id', bilanController.deleteBilan);

module.exports = router;
