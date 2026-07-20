const Vente = require('../models/vente');
const VenteJeu = require('../models/vente_jeu');
const JeuDepot = require('../models/jeuDepot');
const mongoose = require('mongoose')

exports.createVente = async (req, res) => {
    const { acheteurId, vendeurId, montantTotal, commissionVente, jeuxVendus } = req.body;
    if (!acheteurId || !vendeurId || !montantTotal || !commissionVente || !Array.isArray(jeuxVendus)) {
        return res.status(400).json({ message: 'Données de requête invalides' });
    }
    if (jeuxVendus.some(jeu => !jeu.idJeuDepot || !jeu.quantiteVendus)) {
        return res.status(400).json({ message: 'Données invalides pour un ou plusieurs jeux vendus' });
    }
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const vente = new Vente({
            acheteur: new mongoose.Types.ObjectId(acheteurId),
            vendeur: new mongoose.Types.ObjectId(vendeurId),
            commissionVente,
            montantTotal,
            dateVente: new Date()
        });

        const nouvelleVente = await vente.save({ session });

        const venteJeuPromises = jeuxVendus.map(async jeu => {
            const jeuDepot = await JeuDepot.findById(jeu.idJeuDepot).session(session);
            if (!jeuDepot || jeuDepot.quantiteJeu < jeu.quantiteVendus) {
                throw new Error(`Stock insuffisant pour le jeu: ${jeuDepot ? jeuDepot.nomJeu : 'Jeu introuvable'}`);
            }
            jeuDepot.quantiteJeu -= jeu.quantiteVendus;
            await jeuDepot.save({ session });
            const VenteJeuI = await VenteJeu.create([{
                idJeuDepot: jeu.idJeuDepot,
                idVente: nouvelleVente._id,
                quantiteVendus: jeu.quantiteVendus
            }], { session });
            return VenteJeuI;
        });

        await Promise.all(venteJeuPromises);
        await session.commitTransaction();
        session.endSession();
        res.status(201).json({ message: 'Vente et jeux vendus créés avec succès', vente: nouvelleVente });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Erreur lors de la création de la vente:', error);
        res.status(500).json({ message: 'Erreur lors de la création de la vente', error: error.message });
    }
};

//Récupérer toutes les ventes
exports.getAllVentes = async (req, res) => {
    try {
        const ventes = await Vente.find({}).sort({ dateVente: -1 });
        res.status(200).json(ventes);
    } catch (error) {
        console.error('Erreur lors de la récupération des ventes:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des ventes', error: error.message });
    }
}

//Récupérer une vente par l'id de l'acheteur
exports.getVenteByAcheteurId = async (req, res) => {
    const acheteurId = req.params.acheteurId;
    try {
        const ventes = await Vente.find({ acheteur: acheteurId }).sort({ dateVente: -1 });
        res.status(200).json(ventes);
    } catch (error) {
        console.error('Erreur lors de la récupération des ventes:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des ventes', error: error.message });
    }
}

//Récupérer une vente par l'id du vendeur
exports.getVenteByVendeurId = async (req, res) => {
    const vendeurId = req.params.vendeurId;
    try {
        const ventes = await Vente.find({ vendeur: vendeurId }).sort({ dateVente: -1 });
        res.status(200).json(ventes);
    } catch (error) {
        console.error('Erreur lors de la récupération des ventes:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des ventes', error: error.message });
    }
}

