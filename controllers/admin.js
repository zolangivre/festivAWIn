const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET;

// Initialiser un compte administrateur
exports.initAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin déjà existant' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = new Admin({ username, password: hashedPassword, statut: 'Admin' });
        await admin.save();

        res.status(201).json({ message: 'Admin créé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

// Initialiser un compte gestionnaire
exports.initGestionnaire = async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Gestionnaire déjà existant' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = new Admin({ username, password: hashedPassword, statut: 'Gestionnaire' });
        await admin.save();

        res.status(201).json({ message: 'Gestionnaire créé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

// Connexion d'un admin ou gestionnaire
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({ message: 'Utilisateur ou mot de passe incorrect' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Utilisateur ou mot de passe incorrect' });
        }

        if (!admin.statut || !['Admin', 'Gestionnaire'].includes(admin.statut)) {
            return res.status(400).json({ message: 'Rôle invalide' });
        }

        const payload = {
            id: admin._id,
            username: admin.username,
            statut: admin.statut, // Admin ou Gestionnaire
        };

        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });
        
        res.status(200).json({ message: 'Connexion réussie', token });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

// Middleware d'authentification pour vérifier le token
exports.authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Accès interdit' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token invalide ou expiré' });
    }
};

// Accès à la route admin protégée
exports.getAdminPage = (req, res) => {
    res.status(200).json({ message: 'Bienvenue sur la route admin sécurisée !' });
};