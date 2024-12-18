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
        filters.statutJeu = availabilityFilter === 'available' ? 'Disponible' : 'Vendu';
    }

    try {
        const jeuxFiltres = await JeuDepot.find(filters);
        res.status(200).json(jeuxFiltres);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors du filtrage des jeux', error });
    }
};

// Met a jour un jeuDepot (requete pour modifier la quantité du jeuDepot lors d'un achat)
exports.updateJeuDepot = async (req, res) => {
    try {
        const updatedItem = await JeuDepot.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedItem) return res.status(404).send('Item not found');
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(500).send(error.message);
    }
}