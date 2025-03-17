const VenteJeu = require('../models/vente_jeu');

//recuperer tous les jeux vendus par l'id de vente
exports.getJeuxVendusByVenteId = async (req, res) => {
    const idVente = req.params.idVente;
    try {
        const jeuxVendus = await VenteJeu.find({ idVente: idVente });
        res.status(200).json(jeuxVendus);
    } catch (error) {
        console.error('Erreur lors de la récupération des jeux vendus:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des jeux vendus', error: error.message });
    }
}
