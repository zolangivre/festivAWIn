const mongoose = require('mongoose');

const factureSchema = mongoose.Schema({
    acheteur: {
        type: Schema.Types.ObjectId,
        ref: 'Utilisateur',
        required: true
    },
    idVente: {
        type: Schema.Types.ObjectId,
        ref: 'Vente',
        required: true
    },
    dateFacture: {
        type: Date,
        required: true
    },
    montantTotal: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Facture', factureSchema);