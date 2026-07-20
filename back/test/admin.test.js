const request = require('supertest');
const app = require('../app');
const Admin = require('../models/admin');
const bcrypt = require('bcrypt');

beforeEach(async () => {
    await Admin.deleteMany({});
});

describe('POST /initAdmin', () => {
    it('devrait créer un nouvel admin', async () => {
        const response = await request(app)
            .post('/api/admin/init-admin')
            .send({ username: 'adminTest', password: 'password123' });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Admin créé avec succès');

        const admin = await Admin.findOne({ username: 'adminTest' });
        expect(admin).not.toBeNull();
        expect(await bcrypt.compare('password123', admin.password)).toBe(true);
    });

    it('devrait retourner une erreur si l\'admin existe déjà', async () => {
        await new Admin({
            username: 'adminTest',
            password: await bcrypt.hash('password123', 10),
            statut: 'Admin',
        }).save();

        const response = await request(app)
            .post('/api/admin/init-admin')
            .send({ username: 'adminTest', password: 'password123' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Admin déjà existant');
    });
});

describe('POST /initGestionnaire', () => {
    it('devrait créer un nouveau gestionnaire', async () => {
        const response = await request(app)
            .post('/api/admin/init-gestionnaire')
            .send({ username: 'gestionnaireTest', password: 'password123' });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Gestionnaire créé avec succès');

        const gestionnaire = await Admin.findOne({ username: 'gestionnaireTest' });
        expect(gestionnaire).not.toBeNull();
        expect(await bcrypt.compare('password123', gestionnaire.password)).toBe(true);
    });

    it('devrait retourner une erreur si le gestionnaire existe déjà', async () => {
        await new Admin({
            username: 'gestionnaireTest',
            password: await bcrypt.hash('password123', 10),
            statut: 'Gestionnaire',
        }).save();

        const response = await request(app)
            .post('/api/admin/init-gestionnaire')
            .send({ username: 'gestionnaireTest', password: 'password123' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Gestionnaire déjà existant');
    });
});

describe('POST /login', () => {
    it('devrait connecter un admin et renvoyer un token', async () => {
        const hashedPassword = await bcrypt.hash('password123', 10);
        await new Admin({
            username: 'adminTest',
            password: hashedPassword,
            statut: 'Admin',
        }).save();

        const response = await request(app)
            .post('/api/admin/login')
            .send({ username: 'adminTest', password: 'password123' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Connexion réussie');
        expect(response.body.token).toBeDefined();
    });

    it('devrait retourner une erreur pour un mot de passe incorrect', async () => {
        const hashedPassword = await bcrypt.hash('password123', 10);
        await new Admin({
            username: 'adminTest',
            password: hashedPassword,
            statut: 'Admin',
        }).save();

        const response = await request(app)
            .post('/api/admin/login')
            .send({ username: 'adminTest', password: 'wrongPassword' });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Utilisateur ou mot de passe incorrect');
    });

    it('devrait retourner une erreur si l\'admin n\'existe pas', async () => {
        const response = await request(app)
            .post('/api/admin/login')
            .send({ username: 'nonExistentAdmin', password: 'password123' });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Utilisateur ou mot de passe incorrect');
    });
});
