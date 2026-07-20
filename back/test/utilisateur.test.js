const request = require('supertest');
const app = require('../app');
const usersCollection = require('../models/utilisateur');
const Bilan = require('../models/bilan');

let userId;

beforeEach(async () => {
    const user = await new usersCollection({
        nom: 'Dupont',
        prenom: 'Jean',
        mail: 'jean.dupont@example.com',
        telephone: '0123456789',
        adresse: '123 rue de Paris',
        ville: 'Paris',
        codePostal: '75000',
        pays: 'France',
        role: 'Vendeur'
    }).save();

    userId = user._id;
    await new Bilan({
        vendeurId: user._id,
        sommeDues: 0,
        totalFrais: 0,
        totalCommissions: 0,
        gains: 0
    }).save();
});

afterEach(async () => {
    await usersCollection.deleteMany({});
    await Bilan.deleteMany({});
});

describe('GET /utilisateur', () => {
    it('devrait récupérer la liste de tous les utilisateurs', async () => {
        const response = await request(app).get('/api/utilisateur');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].nom).toBe('Dupont');
    });
});

describe('GET /utilisateur/vendeurs', () => {
    it('devrait récupérer la liste de tous les vendeurs', async () => {
        const response = await request(app).get('/api/utilisateur/vendeurs');
        expect(response.status).toBe(200);
        expect(response.body[0].role).toBe('Vendeur');
    });
});

describe('GET /utilisateur/acheteurs', () => {
    it('devrait récupérer la liste de tous les acheteurs', async () => {
        const response = await request(app).get('/api/utilisateur/acheteurs');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(0);
    });
});

const mongoose = require('mongoose');

describe('GET /utilisateur/:id', () => {
    it('devrait récupérer un utilisateur par son ID', async () => {
        const response = await request(app).get(`/api/utilisateur/${userId}`);
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(userId.toString());
    });

    it('devrait retourner une erreur si l\'utilisateur n\'existe pas', async () => {
        const invalidId = new mongoose.Types.ObjectId();

        const response = await request(app).get(`/api/utilisateur/${invalidId}`)
            .send();

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Utilisateur non trouvé');
    });
});


describe('POST /utilisateur', () => {
    it('devrait créer un nouvel utilisateur', async () => {
        const response = await request(app).post('/api/utilisateur')
            .send({
                nom: 'Martin',
                prenom: 'Paul',
                mail: 'paul.martin@example.com',
                telephone: '0987654321',
                adresse: '456 rue de Lyon',
                ville: 'Lyon',
                codePostal: '69000',
                pays: 'France',
                role: 'Acheteur'
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Utilisateur et bilan créés !');
        expect(response.body.user.nom).toBe('Martin');
    });

    it('devrait retourner une erreur si les données sont invalides', async () => {
        const response = await request(app).post('/api/utilisateur')
            .send({
                nom: '',
                prenom: 'Paul',
                mail: 'invalid-email',
                telephone: '0987654321',
                adresse: '456 rue de Lyon',
                ville: 'Lyon',
                codePostal: '69000',
                pays: 'France',
                role: 'Acheteur'
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBeTruthy();
    });
});

describe('PUT /utilisateur/:id', () => {
    it('devrait mettre à jour les informations d\'un utilisateur', async () => {
        const response = await request(app).put(`/api/utilisateur/${userId}`)
            .send({
                nom: 'Dupont',
                prenom: 'Jean',
                mail: 'jean.dupont@newmail.com',
                telephone: '0987654321',
                adresse: '123 rue de Paris',
                ville: 'Paris',
                codePostal: '75000',
                pays: 'France',
                role: 'Vendeur'
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Utilisateur modifié !');
    });

    it('devrait retourner une erreur si l\'utilisateur n\'existe pas', async () => {
        const response = await request(app).put('/api/utilisateur/unknownId')
            .send({
                nom: 'Unknown',
                prenom: 'User'
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBeTruthy();
    });
});

describe('DELETE /utilisateur/:id', () => {
    it('devrait supprimer un utilisateur', async () => {
        const response = await request(app).delete(`/api/utilisateur/${userId}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Utilisateur supprimé !');
        const userDeleted = await usersCollection.findById(userId);
        expect(userDeleted).toBeNull();
    });

    it('devrait retourner une erreur si l\'utilisateur n\'existe pas', async () => {
        const response = await request(app).delete('/api/utilisateur/unknownId');
        expect(response.status).toBe(400);
        expect(response.body.error).toBeTruthy();
    });
});
