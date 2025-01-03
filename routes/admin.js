const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

// Routes admin
router.post('/init-admin', adminController.initAdmin);
router.post('/init-gestionnaire', adminController.initGestionnaire);
router.post('/login', adminController.login); 
router.get('/', adminController.authenticateToken, adminController.getAdminPage);

const authorizeRole = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ message: 'Accès interdit, rôle insuffisant' });
        }
        next();
    };
};

router.get('/isAdmin', adminController.authenticateToken, authorizeRole('Admin'), (req, res) => {
    res.json({ message: 'Bienvenue sur le tableau de bord admin' });
});

router.get('/isGestionnaire', adminController.authenticateToken, authorizeRole('Gestionnaire'), (req, res) => {
    res.json({ message: 'Bienvenue sur le tableau de bord gestionnaire' });
});

module.exports = router;
