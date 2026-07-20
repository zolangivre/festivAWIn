const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 4200;

// Servir les fichiers statiques du dossier "dist"
app.use(express.static(path.join(__dirname, 'dist/festivawin/browser')));

// Rediriger toutes les requêtes vers index.html
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/festivawin/browser/index.html'));
});

app.listen(port, () => {
    console.log(`Application running on port ${port}`);
});
