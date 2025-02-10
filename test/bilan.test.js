const request = require('supertest');
const app = require('../app');
const Bilan = require('../models/bilan');

beforeEach(async () => {
    await Bilan.deleteMany({});
});

describe('POST /createBilan', () => {
    it('devrait créer un bilan', async () => {
        const response = await request(app)
            .post('/api/bilan')
            .send({
                vendeurId: '12345',
                sommeDues: 1000,
                totalFrais: 50,
                totalCommissions: 100,
                gains: 850,
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Bilan enregistré !');

        const bilan = await Bilan.findOne({ vendeurId: '12345' });
        expect(bilan).not.toBeNull();
        expect(bilan.sommeDues).toBe(1000);
    });

    it('devrait retourner une erreur si les données sont manquantes', async () => {
        const response = await request(app)
            .post('/api/bilan')
            .send({
                vendeurId: '12345',
                sommeDues: 1000,
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
    });
});

describe('GET /getBilan', () => {
    it('devrait récupérer tous les bilans', async () => {
        await new Bilan({
            vendeurId: '12345',
            sommeDues: 1000,
            totalFrais: 50,
            totalCommissions: 100,
            gains: 850,
        }).save();

        const response = await request(app).get('/api/bilan');
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });
});

describe('GET /getBilanById/:id', () => {
    it('devrait récupérer un bilan en fonction de l\'id du vendeur', async () => {
        const bilan = await new Bilan({
            vendeurId: '12345',
            sommeDues: 1000,
            totalFrais: 50,
            totalCommissions: 100,
            gains: 850,
        }).save();

        const response = await request(app).get(`/api/bilan/${bilan.vendeurId}`);
        expect(response.status).toBe(200);
        expect(response.body.vendeurId).toBe('12345');
    });

    it('devrait retourner une erreur si le bilan n\'est pas trouvé', async () => {
        const response = await request(app).get('/api/bilan/unknownId');
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Bilan introuvable pour ce vendeur');
    });
});

describe('PUT /updateBilan/:id', () => {
    it('devrait mettre à jour un bilan existant', async () => {
        const bilan = await new Bilan({
            vendeurId: '12345',
            sommeDues: 1000,
            totalFrais: 50,
            totalCommissions: 100,
            gains: 850,
        }).save();

        const response = await request(app)
            .put(`/api/bilan/${bilan._id}`)
            .send({ totalCommissions: 200 });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Bilan modifié avec succès !');

        const updatedBilan = await Bilan.findById(bilan._id);
        expect(updatedBilan.totalCommissions).toBe(200);
    });

    it('devrait retourner une erreur si le bilan à mettre à jour n\'existe pas', async () => {
        const response = await request(app)
            .put('/api/bilan/unknownId')
            .send({ totalCommissions: 200 });

        expect(response.status).toBe(400);
    });
});

describe('DELETE /deleteBilan/:id', () => {
    it('devrait supprimer un bilan existant', async () => {
        const bilan = await new Bilan({
            vendeurId: '12345',
            sommeDues: 1000,
            totalFrais: 50,
            totalCommissions: 100,
            gains: 850,
        }).save();

        const response = await request(app).delete(`/api/bilan/${bilan._id}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Bilan supprimé !');

        const deletedBilan = await Bilan.findById(bilan._id);
        expect(deletedBilan).toBeNull();
    });

    it('devrait retourner une erreur si le bilan à supprimer n\'existe pas', async () => {
        const response = await request(app).delete('/api/bilan/unknownId');
        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
    });
});
