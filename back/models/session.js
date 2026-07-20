const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
    dateDebut: {
        type: Date,
        required: true
    },
    dateFin: {
        type: Date,
        required: true
    },
    fraisDepot: {
        type: Number,
        required: true
    },
    commission: {
        type: Number,
        required: true
    },
    statutSession: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Session', sessionSchema);