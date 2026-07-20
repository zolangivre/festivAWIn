const request = require('supertest');
const app = require('../app'); 
const JeuDepot = require('../models/jeuDepot');
const Utilisateur = require('../models/utilisateur');
const { formatISO } = require('date-fns/formatISO');

let vendeurId;
let jeuDepotId;

beforeEach(async () => {
    const vendeur = await new Utilisateur({
        nom: 'Lemoine',
        prenom: 'Louis',
        adresse: '123 rue des jeux',
        ville: 'Lyon',
        codePostal: '69001',
        pays: 'France',
        mail: 'lemoine.louis@example.com',
        telephone: '0123456789',
        role: 'Vendeur'
    }).save();
    vendeurId = vendeur._id;

    const jeuDepot = await new JeuDepot({
        vendeur: vendeur._id,
        nomJeu: 'Super Jeu',
        editeurJeu: 'Editeur',
        prixJeu: 25.0,
        quantiteJeuDisponible: 5,
        quantiteJeuVendu: 0,
        statutJeu: 'Disponible',
        dateDepot: new Date(),
        fraisDepot: 5.0,
        remiseDepot: 0.0
    }).save();

    jeuDepotId = jeuDepot._id;
});

afterEach(async () => {
    await JeuDepot.deleteMany({});
    await Utilisateur.deleteMany({});
});

describe('GET /jeuxDepotPasSupprimés', () => {
    it('devrait récupérer tous les jeux qui ne sont pas supprimés', async () => {
        const response = await request(app).get('/api/jeuDepot');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].nomJeu).toBe('Super Jeu');
    });
});

describe('GET /jeuxDepot', () => {
    it('devrait récupérer tous les jeux', async () => {
        const response = await request(app).get('/api/jeuDepot/all');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
    });
});

describe('POST /jeuxDepot', () => {
    it('devrait ajouter un nouveau jeu', async () => {
        const response = await request(app).post('/api/jeuDepot')
            .send({
                vendeur: vendeurId,
                nomJeu: 'Jeu B',
                editeurJeu: 'Editeur',
                prixJeu: 20.0,
                quantiteJeuDisponible: 10,
                quantiteJeuVendu: 0,
                statutJeu: 'Disponible',
                dateDepot: new Date(),
                fraisDepot: 5.0,
                remiseDepot: 0.0
            });

        expect(response.status).toBe(201);
        expect(response.body.nomJeu).toBe('Jeu B');
    });
});

describe('GET /jeuxDepot/:userId', () => {
    it('devrait récupérer tous les jeux d\'un utilisateur par son id', async () => {
        const response = await request(app).get(`/api/jeuDepot/user/${vendeurId}`);
        expect(response.status).toBe(200);
        expect(response.body[0].vendeur.toString()).toBe(vendeurId.toString());
    });
});

describe('PUT /jeuxDepot/:jeuId', () => {
    it('devrait mettre à jour un jeu', async () => {
        const response = await request(app).put(`/api/jeuDepot/${jeuDepotId}`)
            .send({
                quantiteJeuDisponible: 0
            });

        expect(response.status).toBe(200);
        expect(response.body.quantiteJeuDisponible).toBe(0);
        expect(response.body.statutJeu).toBe('Vendu');
    });
});

describe('DELETE /jeuxDepot/:jeuId', () => {
    it('devrait supprimer un jeu', async () => {
        const response = await request(app).delete(`/api/jeuDepot/${jeuDepotId}`);
        expect(response.status).toBe(204);

        const jeuDeleted = await JeuDepot.findById(jeuDepotId);
        expect(jeuDeleted).toBeNull();
    });
});

describe('DELETE /jeuxDepot/user/:userId', () => {
    it('devrait supprimer tous les jeux d\'un utilisateur', async () => {
        const response = await request(app).delete(`/api/jeuDepot/user/${vendeurId}`);
        expect(response.status).toBe(204);

        const jeuxDeleted = await JeuDepot.find({ vendeur: vendeurId });
        expect(jeuxDeleted).toHaveLength(0);
    });
});

describe('GET /jeuxDepot/:jeuId', () => {
    it('devrait récupérer un jeu par son id', async () => {
        const response = await request(app).get(`/api/jeuDepot/${jeuDepotId}`);
        expect(response.status).toBe(200);
        expect(response.body.nomJeu).toBe('Super Jeu');
    });
});
