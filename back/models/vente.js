const mongoose = require('mongoose');

const venteSchema = mongoose.Schema({
    acheteur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Utilisateur',
        required: true
    },
    vendeur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Utilisateur',
        required: true
    },
    commissionVente: {
        type: Number,
        required: true
    },
    dateVente: {
        type: Date,
        default: Date.now
    },
    montantTotal: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Vente', venteSchema);