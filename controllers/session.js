const sessionCollection = require('../models/session');

//Recupere la session dont le statut est Planifiée

exports.getSessionPlanifiee = (req, res, next) => {
    sessionCollection.find({ statutSession: 'Planifiée' }).then(
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
    sessionCollection.find({ statutSession: 'En cours' }).then(
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
    const session = new sessionCollection({
        dateDebut: req.body.dateDebut,
        dateFin: req.body.dateFin,
        fraisDepot: req.body.fraisDepot,
        statutSession: req.body.statutSession
    });
    session.save().then(
        () => {
        res.status(201).json({
            message: 'Session enregistrée !'
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