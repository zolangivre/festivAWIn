require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const userRoutes = require('./routes/utilisateur');
const jeuDepotRoutes = require('./routes/jeuDepot');
const venteRoutes = require('./routes/vente');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const apiUrlFront = process.env.API_URL;
const secret = process.env.SECRET;

mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@atlascluster.xqnftpq.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=AtlasCluster`)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(cors({
  origin: apiUrlFront,
  credentials: true
}));

app.use(cookieParser());

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

module.exports = app;