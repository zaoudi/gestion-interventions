const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/login', async (req, res) => {
    try {
        const { nom_utilisateur, mot_de_passe } = req.body;
        const result = await db.execute({
            sql: 'SELECT * FROM Utilisateurs WHERE nom_utilisateur = ? AND mot_de_passe = ?',
            args: [nom_utilisateur, mot_de_passe]
        });

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Identifiant ou mot de passe incorrect' });
        }

        const user = result.rows[0];
        res.json({ message: 'Connexion réussie ✅', user: { id: user.id, nom_utilisateur: user.nom_utilisateur, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;