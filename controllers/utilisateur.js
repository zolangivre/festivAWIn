const usersCollection = require('../models/utilisateur');

//Récupère la liste de tous les utilisateurs (vendeurs, acheteurs, gestionnaires, administrateurs).
exports.getAllUsers = (req, res, next) => {
  usersCollection.find().sort({ nom: 1 }).then(
    (utilisateur) => {
      res.status(200).json(utilisateur);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

//Récupère la liste de tous les vendeurs.
exports.getAllSellers= (req, res, next) => {
    usersCollection.find({ role: 'Vendeur' }).sort({ nom: 1 }).then(
        (sellers) => {
            res.status(200).json(sellers);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

//Récupère la liste de tous les acheteurs.
exports.getAllBuyers= (req, res, next) => {
    usersCollection.find({ role: 'Acheteur' }).sort({ nom: 1 }).then(
        (buyers) => {
            res.status(200).json(buyers);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

//Récupère les informations d’un utilisateur spécifique par son idUtilisateur.
exports.getUserById = (req, res, next) => {
  const userId = req.params.id;

  usersCollection.findOne({ _id: userId })
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
      res.status(200).json(user);
    })
    .catch(error => {
      console.error(error); 
      res.status(500).json({ error: error.message }); 
    });
};

//Crée un nouvel utilisateur (vendeur, acheteur).
exports.createUser = (req, res, next) => {
  const user = new usersCollection({
    nom: req.body.nom,
    prenom: req.body.prenom,
    mail: req.body.mail,
    telephone: req.body.telephone,
    adresse: req.body.adresse,
    role: req.body.role
  });

  user.save()
    .then((savedUser) => {
      res.status(201).json({
        message: 'Utilisateur créé !',
        user: savedUser // Retourne l'utilisateur créé
      });
    })
    .catch(error => res.status(400).json({ error }));
};

//Met à jour les informations d’un utilisateur existant par son idUtilisateur.
exports.updateUser = (req, res, next) => {
    const userId = req.params.id;
    
    usersCollection.updateOne({ _id: userId }, { ...req.body, _id: userId })
        .then(() => res.status(200).json({ message: 'Utilisateur modifié !' }))
        .catch(error => res.status(400).json({ error }));
};

//Supprime un utilisateur spécifique par son idUtilisateur.
exports.deleteUser = (req, res, next) => {
    const userId = req.params.id;
    
    usersCollection.deleteOne({ _id: userId })
        .then(() => res.status(200).json({ message: 'Utilisateur supprimé !' }))
        .catch(error => res.status(400).json({ error }));
};


