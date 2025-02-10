const request = require('supertest');
const app = require('../app'); 
const VenteJeu = require('../models/vente_jeu');
const mongoose = require('mongoose');

let venteId;

beforeEach(async () => {
    const vente = await new VenteJeu({
        idVente: new mongoose.Types.ObjectId(), 
        idJeuDepot: new mongoose.Types.ObjectId(), 
        quantiteVendus: 2
    }).save();

    venteId = vente.idVente;
});

afterEach(async () => {
    await VenteJeu.deleteMany({});
});

describe('GET /vente_jeu/:idVente', () => {
    it('devrait récupérer les jeux vendus par l\'id de vente', async () => {
        const response = await request(app).get(`/api/venteJeu/${venteId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].quantiteVendus).toBe(2);
    });

    it('devrait retourner un message d\'erreur si aucun jeu trouvé', async () => {
        const unknownId = new mongoose.Types.ObjectId();
        const response = await request(app).get(`/api/venteJeu/${unknownId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(0);
    });

    it('devrait retourner une erreur si le format de l\'id de vente est invalide', async () => {
        const response = await request(app).get('/api/venteJeu/invalidId'); // Correction du chemin
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Erreur lors de la récupération des jeux vendus'); // Vérifie le message retourné
    });
});
