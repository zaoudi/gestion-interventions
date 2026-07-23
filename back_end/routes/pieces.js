const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const result = await db.execute('SELECT * FROM Pieces');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { nom, quantite_stock } = req.body;
        const result = await db.execute({
            sql: `INSERT INTO Pieces (nom, quantite_stock) VALUES (?, ?)`,
            args: [nom, quantite_stock || 0]
        });
        res.status(201).json({ message: 'Pièce ajoutée ✅', id: Number(result.lastInsertRowid) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await db.execute({
            sql: 'DELETE FROM Pieces WHERE id = ?',
            args: [req.params.id]
        });
        res.json({ message: 'Pièce supprimée ✅' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;