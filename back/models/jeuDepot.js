const mongoose = require('mongoose');

const jeuDepotSchema = mongoose.Schema({
    vendeur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Utilisateur',
        required: true
    },
    nomJeu: {
        type: String,
        required: true
    },
    editeurJeu: {
        type: String,
        required: true
    },
    prixJeu: {
        type: Number,
        required: true
    },
    quantiteJeuDisponible: {
        type: Number,
        required: true
    },
    quantiteJeuVendu: {
        type: Number,
        required: true
    },
    statutJeu: {
        type: String,
        enum: ['Disponible', 'Vendu', 'Supprimé'],
        required: true
    },
    dateDepot: {
        type: Date,
        default: Date.now
    },
    fraisDepot: {
        type: Number,
        required: true
    },
    remiseDepot: {
        type: Number,
        required: true
    },
});

module.exports = mongoose.model('JeuDepot', jeuDepotSchema);