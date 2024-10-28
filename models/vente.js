const mongoose = require('mongoose');

const venteSchema = ongoose.Schema({
    acheteur: {
        type: Schema.Types.ObjectId,
        ref: 'Utilisateur',
        required: true
    },
    vendeur: {
        type: Schema.Types.ObjectId,
        ref: 'Utilisateur',
        required: true
    },
    commissionVente: {
        type: Number,
        required: true
    },
    dateVente: {
        type: Date,
        required: true
    },
    montantTotal: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Vente', venteSchema);