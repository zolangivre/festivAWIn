const JeuDepot = require('../models/jeuDepot');

// Récupérer tous les jeux
exports.getJeuxDepot = async (req, res) => {
    try {
        const jeux = await JeuDepot.find();
        res.status(200).json(jeux);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des jeux', error });
    }
};

// Ajouter un jeu
exports.createJeuDepot = async (req, res) => {
    const jeuDepot = new JeuDepot(req.body);
    try {
        const nouveauJeu = await jeuDepot.save();
        res.status(201).json(nouveauJeu);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création du jeu', error });
    }
};

// Filtrer les jeux
exports.filterJeuxDepot = async (req, res) => {
    const { searchTerm, minPrice, maxPrice, availabilityFilter } = req.query;
    // console.log(req.query); // renvoie par exemple : { availabilityFilter: 'Disponible' }
    const filters = {};

    if (searchTerm) {
        filters.nomJeu = new RegExp(`^${searchTerm}`, 'i');
    }
    if (minPrice) {
        filters.prixJeu = { ...filters.prixJeu, $gte: parseFloat(minPrice) };
    }
    if (maxPrice) {
        filters.prixJeu = { ...filters.prixJeu, $lte: parseFloat(maxPrice) };
    }
    if (availabilityFilter && availabilityFilter !== 'all') {
        filters.statutJeu = availabilityFilter === 'Disponible' ? 'Disponible' : 'Vendu';
    }

    try {
        const jeuxFiltres = await JeuDepot.find(filters);
        res.status(200).json(jeuxFiltres);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors du filtrage des jeux', error });
    }
};


// exports.updateJeuDepot = async (req, res) => {
//     try {
//         const updatedItem = await JeuDepot.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         if (!updatedItem) return res.status(404).send('Item not found');
//         res.status(200).json(updatedItem);
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// }

//Récupérer tout les jeux d'un utlisateur par son id
exports.getJeuxDepotByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const jeux = await JeuDepot.find({ vendeur: userId });
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
        const jeu = await JeuDepot.findByIdAndUpdate(jeuId, updates, { new: true });
        if (!jeu) {
            return res.status(404).json({ message: 'Jeu non trouvé' });
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