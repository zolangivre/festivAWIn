const mongoose = require('mongoose');

const venteJeuSchema = mongoose.Schema({
    idJeuDepot: {
        type: Schema.Types.ObjectId,
        ref: 'JeuDepot',
        required: true
    },
    idVente: {
        type: Schema.Types.ObjectId,
        ref: 'Vente',
        required: true
    },
    quantiteVendus: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('VenteJeu', venteJeuSchema);