const mongoose = require('mongoose');

const utilisateurSchema = mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    prenom: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: [true, "Please provide an Email!"],
        unique: [true, "Email Exist"],
    },
    telephone: {
        type: String
    },
    adresse: {
        type: String
    },
    role: { 
        type: String,
        enum: ['Admin', 'Vendeur', 'Acheteur', 'Gestionnaire'],
        required: true
    },
});

module.exports = mongoose.model('Utilisateur', utilisateurSchema);