const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

// Routes admin
router.post('/init-admin', adminController.initAdmin);
router.post('/login', adminController.login); 
router.get('/', adminController.authenticateToken, adminController.getAdminPage);

module.exports = router;
