const JeuDepot = require('../models/jeuDepot');

// Récupérer tous les jeux qui ne sont pas supprimés
exports.getJeuxDepotPasSupprimés = async (req, res) => {
    try {
        const jeux = await JeuDepot.find({ statutJeu: { $ne: 'Supprimé' } }).sort({ dateDepot: -1 });
        res.status(200).json(jeux);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des jeux', error });
    }
};

// Récupérer tous les jeux
exports.getJeuxDepot = async (req, res) => {
    try {
        const jeux = await JeuDepot.find().sort({ dateDepot: -1 });
        res.status(200).json(jeux);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des jeux', error });
    }
};

// Ajouter un jeu
exports.createJeuDepot = async (req, res) => {
    const jeuDepot = new JeuDepot(req.body);
    console.log(jeuDepot);
    try {
        const nouveauJeu = await jeuDepot.save();
        res.status(201).json(nouveauJeu);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création du jeu', error });
    }
};

//Récupérer tout les jeux d'un utlisateur par son id
exports.getJeuxDepotByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const jeux = await JeuDepot.find({ vendeur: userId }).sort({ dateDepot: -1 });
        res.status(200).json(jeux);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des jeux', error });
    }
}

// Met a jour un jeuDepot (requete pour modifier la quantité du jeuDepot lors d'un achat)
exports.updateJeuDepot = async (req, res) => {
    const { jeuId } = req.params;
    const updates = req.body;

    try {
        let jeu = await JeuDepot.findByIdAndUpdate(jeuId, updates, { new: true });
        if (!jeu) {
            return res.status(404).json({ message: 'Jeu non trouvé' });
        }

        // Vérifier si la quantité est 0 et mettre à jour le statut
        if (jeu.quantiteJeuDisponible === 0 && jeu.statutJeu === 'Disponible') {
            jeu.statutJeu = 'Vendu';
            jeu = await jeu.save(); // Sauvegarder les modifications
        }

        res.status(200).json(jeu);
    } catch (error) {
        console.error('Erreur lors de la mise à jour :', error);
        res.status(500).json({ message: 'Erreur lors de la modification du jeu', error });
    }
};

//Supprimer un jeu
exports.deleteJeuDepot = async (req, res) => {
    const { jeuId } = req.params;
    try {
        await JeuDepot.findByIdAndDelete(jeuId);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du jeu', error });
    }
};

//Supprimer tout les jeux d'un utilisateur

exports.deleteAllJeuxDepotByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        await JeuDepot.deleteMany({ vendeur: userId });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression des jeux', error });
    }
}

//Récupérer un jeu par son id
exports.getJeuDepotById = async (req, res) => {
    const { jeuId } = req.params;
    try {
        const jeu = await JeuDepot.findById(jeuId);
        res.status(200).json(jeu);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du jeu', error });
    }
}