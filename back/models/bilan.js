const mongoose = require('mongoose');

const bilanSchema = mongoose.Schema({
    vendeurId: {
        type: String,
        required: true
    },
    sommeDues: {
        type: Number,
        required: true
    },
    totalFrais: {
        type: Number,
        required: true
    },
    totalCommissions: {
        type: Number,
        required: true
    },
    gains: {
        type: Number,
        required: true
    },
});

module.exports = mongoose.model('Bilan', bilanSchema);
