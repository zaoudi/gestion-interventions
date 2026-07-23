const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const result = await db.execute('SELECT * FROM Techniciens');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { nom, prenom, competence, disponible } = req.body;
        const result = await db.execute({
            sql: `INSERT INTO Techniciens (nom, prenom, competence, disponible) VALUES (?, ?, ?, ?)`,
            args: [nom, prenom, competence, disponible ?? 1]
        });
        res.status(201).json({ message: 'Technicien ajouté ✅', id: Number(result.lastInsertRowid) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { nom, prenom, competence, disponible } = req.body;
        await db.execute({
            sql: `UPDATE Techniciens SET nom = ?, prenom = ?, competence = ?, disponible = ? WHERE id = ?`,
            args: [nom, prenom, competence, disponible, req.params.id]
        });
        res.json({ message: 'Technicien modifié ✅' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await db.execute({
            sql: 'DELETE FROM Techniciens WHERE id = ?',
            args: [req.params.id]
        });
        res.json({ message: 'Technicien supprimé ✅' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;