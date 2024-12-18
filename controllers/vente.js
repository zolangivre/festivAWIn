const Vente = require('../models/vente');
const Utilisateur = require('../models/utilisateur');
const VenteJeu = require('../models/vente_jeu');
const JeuDepot = require('../models/jeuDepot');
const mongoose = require('mongoose')

exports.createVente = async (req, res) => {
    const { acheteurId, vendeurId, montantTotal, commissionVente, jeuxVendus } = req.body;

    // Validation des données
    if (!acheteurId || !vendeurId || !montantTotal || !commissionVente || !Array.isArray(jeuxVendus)) {
        return res.status(400).json({ message: 'Données de requête invalides' });
    }
    if (jeuxVendus.some(jeu => !jeu.idJeuDepot || !jeu.quantiteVendus)) {
        return res.status(400).json({ message: 'Données invalides pour un ou plusieurs jeux vendus' });
    }

    // Démarrage de la transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Création de la vente
        const vente = new Vente({
            acheteur: new mongoose.Types.ObjectId(acheteurId),
            vendeur: new mongoose.Types.ObjectId(vendeurId),
            commissionVente,
            montantTotal,
            dateVente: new Date()
        });

        const nouvelleVente = await vente.save({ session });

        // Création des VenteJeu associés
        const venteJeuPromises = jeuxVendus.map(async jeu => {
            const jeuDepot = await JeuDepot.findById(jeu.idJeuDepot).session(session);
            if (!jeuDepot || jeuDepot.quantiteJeu < jeu.quantiteVendus) {
                throw new Error(`Stock insuffisant pour le jeu: ${jeuDepot ? jeuDepot.nomJeu : 'Jeu introuvable'}`);
            }

            // Mise à jour du stock du jeu
            jeuDepot.quantiteJeu -= jeu.quantiteVendus;
            await jeuDepot.save({ session });

            // Création du VenteJeu
            const VenteJeuI = await VenteJeu.create([{
                idJeuDepot: jeu.idJeuDepot,
                idVente: nouvelleVente._id,
                quantiteVendus: jeu.quantiteVendus
            }], { session });

            console.log("VenteJeu crée avec succes :", VenteJeuI);
            return VenteJeuI;
        });

        await Promise.all(venteJeuPromises);

        // Validation de la transaction
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