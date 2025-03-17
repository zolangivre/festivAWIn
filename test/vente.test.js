const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Vente = require('../models/vente');
const VenteJeu = require('../models/vente_jeu');
const JeuDepot = require('../models/jeuDepot');
const Utilisateur = require('../models/utilisateur');

let acheteurId, vendeurId, jeuDepotId, venteId;

beforeEach(async () => {
    // Création d'un acheteur et d'un vendeur
    const acheteur = await new Utilisateur({ nom: 'Acheteur', prenom: 'Test', role: 'Acheteur', mail:'acheteur@gmail.com' }).save();
    const vendeur = await new Utilisateur({ nom: 'Vendeur', prenom: 'Test', role: 'Vendeur', mail:'vendeur@gmail.com'}).save();

    acheteurId = acheteur._id;
    vendeurId = vendeur._id;

    // Création d'un jeu en dépôt
    const jeuDepot = await new JeuDepot({
        nomJeu: 'Jeu Test',
        quantiteJeu: 5,
        prixJeu: 10,
        vendeur: vendeurId,
        editeurJeu: 'Editeur Test',
        statutJeu: 'Disponible',
        fraisDepot: 1,
        remiseDepot: 0,
        quantiteJeuDisponible: 5,
        quantiteJeuVendu: 0,
        dateDepot: new Date()

    }).save();
    jeuDepotId = jeuDepot._id;

    // Création d'une vente
    const vente = await new Vente({
        acheteur: acheteurId,
        vendeur: vendeurId,
        commissionVente: 2,
        montantTotal: 20,
        dateVente: new Date()
    }).save();
    venteId = vente._id;

    // Ajout du jeu vendu
    await new VenteJeu({
        idVente: venteId,
        idJeuDepot: jeuDepotId,
        quantiteVendus: 2
    }).save();
});

afterEach(async () => {
    await Vente.deleteMany({});
    await VenteJeu.deleteMany({});
    await JeuDepot.deleteMany({});
    await Utilisateur.deleteMany({});
});

describe('POST /api/ventes', () => {
    it('devrait créer une nouvelle vente avec succès', async () => {
        const response = await request(app)
            .post('/api/vente')
            .send({
                acheteurId,
                vendeurId,
                montantTotal: 30,
                commissionVente: 3,
                jeuxVendus: [{ idJeuDepot: jeuDepotId, quantiteVendus: 1 }]
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Vente et jeux vendus créés avec succès');
        expect(response.body.vente).toHaveProperty('_id');
    });

    it("devrait retourner une erreur si les données sont incomplètes", async () => {
        const response = await request(app)
            .post('/api/vente')
            .send({
                acheteurId,
                vendeurId
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Données de requête invalides");
    });
});

describe('GET /api/ventes', () => {
    it("devrait récupérer toutes les ventes", async () => {
        const response = await request(app).get('/api/vente');
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThanOrEqual(1);
    });
});

describe('GET /api/ventes/acheteur/:acheteurId', () => {
    it("devrait récupérer les ventes par ID d'acheteur", async () => {
        const response = await request(app).get(`/api/vente/acheteur/${acheteurId}`);
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThanOrEqual(1);
    });

    it("devrait retourner une liste vide si l'acheteur n'a pas de ventes", async () => {
        const response = await request(app).get(`/api/vente/acheteur/${new mongoose.Types.ObjectId()}`);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(0);
    });
});

describe('GET /api/ventes/vendeur/:vendeurId', () => {
    it("devrait récupérer les ventes par ID de vendeur", async () => {
        const response = await request(app).get(`/api/vente/vendeur/${vendeurId}`);
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThanOrEqual(1);
    });

    it("devrait retourner une liste vide si le vendeur n'a pas de ventes", async () => {
        const response = await request(app).get(`/api/vente/vendeur/${new mongoose.Types.ObjectId()}`);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(0);
    });
});
