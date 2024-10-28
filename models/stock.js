const mongoose = require('mongoose');

const stockSchema = mongoose.Schema({
    idUtilisateur: {
        type: Schema.Types.ObjectId,
        ref: 'Utilisateur',
        required: true
    },
    idJeuDepot: {
        type: Schema.Types.ObjectId,
        ref: 'JeuDepot',
        required: true
    },
    quantiteStock: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Stock', stockSchema);