require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const userRoutes = require('./routes/utilisateur');
const jeuDepotRoutes = require('./routes/jeuDepot');
const venteRoutes = require('./routes/vente');
const sessionRoutes = require('./routes/session');
const adminRoutes = require('./routes/admin');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const apiUrlFront = process.env.API_URL;
const secret = process.env.SECRET;
const clusterName = process.env.CLUSTER_NAME;

mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.y1q5r.mongodb.net/?retryWrites=true&w=majority&appName=${clusterName}`)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(cors({
  origin: apiUrlFront,
  credentials: true
}));

app.use(bodyParser.json());

app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: true, secure: true }
}));

app.use(express.json());

app.use('/api/utilisateur', userRoutes);
app.use('/api/jeuDepot', jeuDepotRoutes);
app.use('/api/vente', venteRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/admin', adminRoutes);


module.exports = app;