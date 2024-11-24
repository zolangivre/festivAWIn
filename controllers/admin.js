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

        const admin = new Admin({ username, password: hashedPassword });
        await admin.save();

        res.status(201).json({ message: 'Admin créé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

// Connexion d'un administrateur
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

        const token = jwt.sign({ id: admin._id, username: admin.username }, SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({ message: 'Connexion réussie', token });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

//Deconnexion d'un administrateur

exports.logout = async (req, res) => {
    try {
        const { username } = req.body;

        const admin = await Admin
            .findOne({ username })
            .then((admin) => {
                if (!admin) {
                    return res.status(401).json({ message: 'Utilisateur non trouvé' });
                }
                res.status(200).json({ message: 'Déconnexion réussie' });
            });
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

// Middleware d'authentification pour vérifier le token
exports.authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'Accès interdit' });
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], SECRET_KEY);
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