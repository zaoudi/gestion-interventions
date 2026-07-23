const express = require('express');
const cors = require('cors');
const path = require('path');
const interventionsRoutes = require('./routes/interventions');
const techniciensRoutes = require('./routes/techniciens');
const authRoutes = require('./routes/auth');
const clientsRoutes = require('./routes/clients');
const piecesRoutes = require('./routes/pieces');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/interventions', interventionsRoutes);
app.use('/api/techniciens', techniciensRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/pieces', piecesRoutes);

// Sert les fichiers du frontend (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname, '..', 'front_end')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});