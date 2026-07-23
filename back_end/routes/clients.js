const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const result = await db.execute('SELECT * FROM Clients');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { nom, telephone, adresse } = req.body;
        const result = await db.execute({
            sql: `INSERT INTO Clients (nom, telephone, adresse) VALUES (?, ?, ?)`,
            args: [nom, telephone, adresse]
        });
        res.status(201).json({ message: 'Client ajouté ✅', id: Number(result.lastInsertRowid) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await db.execute({
            sql: 'DELETE FROM Clients WHERE id = ?',
            args: [req.params.id]
        });
        res.json({ message: 'Client supprimé ✅' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;