const request = require('supertest');
const app = require('../app');
const sessionCollection = require('../models/session');

let sessionId;

beforeEach(async () => {
    const session = await new sessionCollection({
        dateDebut: new Date('2025-02-01T10:00:00Z'),
        dateFin: new Date('2025-02-10T10:00:00Z'),
        fraisDepot: 10,
        commission: 5,
        statutSession: 'Planifiee'
    }).save();

    sessionId = session._id;
});

afterEach(async () => {
    await sessionCollection.deleteMany({});
});

describe('GET /sessions/planifiees', () => {
    it('devrait récupérer toutes les sessions planifiées', async () => {
        const response = await request(app).get('/api/session/planifiee');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].statutSession).toBe('Planifiee');
    });
});

describe('GET /sessions/next', () => {
    it('devrait récupérer la prochaine session planifiée', async () => {
        const response = await request(app).get('/api/session/nextsession');
        expect(response.status).toBe(200);
        expect(response.body.statutSession).toBe('Planifiee');
    });

    it('devrait retourner une erreur si aucune session planifiée', async () => {
        await sessionCollection.deleteMany({});
        const response = await request(app).get('/api/session/nextsession');
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Aucune session planifiée trouvée.');
    });
});

describe('GET /sessions/active', () => {
    it('devrait vérifier si une session est active', async () => {
        const response = await request(app).get('/api/session/activesession');
        expect(response.status).toBe(200);
        expect(response.body.isActive).toBe(false);
    });
});

describe('POST /sessions', () => {
    it('devrait créer une nouvelle session', async () => {
        const response = await request(app).post('/api/session')
            .send({
                dateDebut: new Date('2025-02-15T10:00:00Z'),
                dateFin: new Date('2025-02-20T10:00:00Z'),
                fraisDepot: 20,
                commission: 10,
                statutSession: 'Planifiee'
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Session enregistrée avec succès !');
    });

    it('devrait retourner une erreur si une session se chevauche', async () => {
        const response = await request(app).post('/api/session')
            .send({
                dateDebut: new Date('2025-02-05T10:00:00Z'),
                dateFin: new Date('2025-02-08T10:00:00Z'),
                fraisDepot: 20,
                commission: 10,
                statutSession: 'Planifiee'
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Une session se chevauche avec celle-ci.');
    });
});

describe('PUT /sessions/status', () => {
    it('devrait mettre à jour le statut des sessions', async () => {
        const response = await request(app).put('/api/session/update');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Statuts des sessions mis à jour avec succès.');
    });
});

describe('GET /sessions/:id', () => {
    it('devrait récupérer une session par son ID', async () => {
        const response = await request(app).get(`/api/session/${sessionId}`);
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(sessionId.toString());
    });

    it('devrait retourner une erreur si la session n\'existe pas', async () => {
        const response = await request(app).get('/api/session/unknownId');
        expect(response.status).toBe(404);
    });
});

describe('DELETE /sessions/:id', () => {
    it('devrait supprimer une session', async () => {
        const response = await request(app).delete(`/api/session/${sessionId}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Session supprimée !');
        const sessionDeleted = await sessionCollection.findById(sessionId);
        expect(sessionDeleted).toBeNull();
    });
});

describe('GET /sessions', () => {
    it('devrait récupérer toutes les sessions', async () => {
        const response = await request(app).get('/api/session');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
    });
});
