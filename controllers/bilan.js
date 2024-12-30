const Bilan = require('../models/bilan');

//creer un bilan 

exports.createBilan = (req, res, next) => {
    const bilan = new Bilan({
        vendeurId: req.body.vendeurId,
        sommeDues: req.body.sommeDues,
        totalFrais: req.body.totalFrais,
        totalCommissions: req.body.totalCommissions,
        gains: req.body.gains
    });
    bilan.save()
        .then(() => res.status(201).json({ message: 'Bilan enregistré !' }))
        .catch(error => res.status(400).json({ error }));
}

exports.getBilan = (req, res, next) => {
    Bilan.find()
        .then(bilans => res.status(200).json(bilans))
        .catch(error => res.status(400).json({ error }));
}

//recupoerer bilan en fonction de l'id du vendeur

exports.getBilanById = (req, res, next) => {
    Bilan.findOne({ vendeurId: req.params.id }) // Assurez-vous que req.params.id correspond au vendeurId
        .then(bilan => {
            if (!bilan) {
                return res.status(404).json({ message: 'Bilan introuvable pour ce vendeur' });
            }
            res.status(200).json(bilan);
        })
        .catch(error => res.status(400).json({ error }));
};

//modifier un bilan

exports.updateBilan = (req, res, next) => {
    Bilan.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(result => {
            if (result.modifiedCount === 0) {
                return res.status(404).json({ message: 'Aucun bilan trouvé à mettre à jour' });
            }
            res.status(200).json({ message: 'Bilan modifié avec succès !' });
        })
        .catch(error => res.status(400).json({ error }));
};


//supprimer un bilan

exports.deleteBilan = (req, res, next) => {
    Bilan.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Bilan supprimé !' }))
        .catch(error => res.status(400).json({ error }));
}