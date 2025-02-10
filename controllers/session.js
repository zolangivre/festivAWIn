const sessionCollection = require('../models/session');

//Recupere la session dont le statut est Planifiée
exports.getSessionPlanifiee = (req, res, next) => {
    sessionCollection.find({ statutSession: 'Planifiee' }).then(
        (session) => {
        res.status(200).json(session);
        }
    ).catch(
        (error) => {
        res.status(400).json({
            error: error
        });
        }
    );
};

//Recupere la session suivante
exports.getNextPlannedSession = async (req, res, next) => {
    try {
        const nextSession = await sessionCollection.findOne({ statutSession: 'Planifiee' }).sort({ dateDebut: 1 }).exec();
        if (!nextSession) {
            return res.status(404).json({ message: 'Aucune session planifiée trouvée.' });
        }
        res.status(200).json(nextSession);
    } catch (error) {
        res.status(400).json({ error });
    }
};

//Recupere la session dont le statut est en cours
exports.isSessionActive = async (req, res, next) => {
    try {
        const activeSession = await sessionCollection.findOne({ statutSession: 'En Cours' });
        if (activeSession) {
            return res.status(200).json({ isActive: true });
        } else {
            return res.status(200).json({ isActive: false });
        }
    } catch (error) {
        res.status(400).json({ error });
    }
};
    
//Recupere la session dont le statut est En cours
exports.getSessionEnCours = (req, res, next) => {
    sessionCollection.findOne({ statutSession: 'En Cours' }).then(
        (session) => {
        res.status(200).json(session);
        }
    ).catch(
        (error) => {
        res.status(400).json({
            error: error
        });
        }
    );
}

//Creer une session
exports.createSession = (req, res, next) => {
    const { dateDebut, dateFin } = req.body;
    const startDate = new Date(dateDebut);
    const endDate = new Date(dateFin);
    sessionCollection.findOne({
        $or: [
            {
                dateDebut: { $lt: endDate },
                dateFin: { $gt: startDate },
            }
        ]
    })
        .then(existingSession => {
            if (existingSession) {
                return res.status(400).json({ message: 'Une session se chevauche avec celle-ci.' });
            }
            const newSession = new sessionCollection({
                dateDebut,
                dateFin,
                fraisDepot: req.body.fraisDepot,
                commission: req.body.commission,
                statutSession: req.body.statutSession
            });

            newSession.save()
                .then(() => {
                    res.status(201).json({
                        message: 'Session enregistrée avec succès !'
                    });
                })
                .catch((error) => {
                    res.status(400).json({ error: error.message });
                });
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
};


exports.updateSessionStatus = async (req, res, next) => {
    try {
        const now = new Date();
        const sessions = await sessionCollection.find({ statutSession: { $in: ['En Cours', 'Planifiee'] } });

        sessions.forEach(async (session) => {
            if (session.dateFin < now) {
                session.statutSession = 'Terminee';
                await session.save();
            } else if (session.dateDebut <= now && session.dateFin >= now) {
                session.statutSession = 'En Cours';
                await session.save();
            }
        });

        res.status(200).json({ message: 'Statuts des sessions mis à jour avec succès.' });
    } catch (error) {
        res.status(400).json({ error });
    }
};

//Recuperer toutes les sessions
exports.getAllSessions = (req, res, next) => {
    sessionCollection.find().then(
        (sessions) => {
        res.status(200).json(sessions);
        }
    ).catch(
        (error) => {
        res.status(400).json({
            error: error
        });
        }
    );
}

//Supprimer une session
exports.deleteSession = (req, res, next) => {
    sessionCollection.deleteOne({ _id: req.params.id }).then(
        () => {
        res.status(200).json({
            message: 'Session supprimée !'
        });
        }
    ).catch(
        (error) => {
        res.status(400).json({
            error: error
        });
        }
    );
}

//Recuperer une session par son id
exports.getSessionById = (req, res, next) => {
    sessionCollection.findOne({ _id: req.params.id }).then(
        (session) => {
        res.status(200).json(session);
        }
    ).catch(
        (error) => {
        res.status(404).json({
            error: error
        });
        }
    );
}