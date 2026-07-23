const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET - récupérer toutes les interventions (avec le nom du technicien assigné)
router.get('/', async (req, res) => {
    try {
        const sql = `
            SELECT Interventions.*, Techniciens.nom AS tech_nom, Techniciens.prenom AS tech_prenom
            FROM Interventions
            LEFT JOIN Techniciens ON Interventions.id_technicien = Techniciens.id
        `;
        const result = await db.execute(sql);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - créer une intervention
router.post('/', async (req, res) => {
    try {
        const { titre, description, id_technicien, id_client, date_planifiee } = req.body;
        const sql = `INSERT INTO Interventions (titre, description, id_technicien, id_client, date_planifiee) 
                     VALUES (?, ?, ?, ?, ?)`;
        const result = await db.execute({
            sql,
            args: [titre, description, id_technicien || null, id_client || null, date_planifiee]
        });
        res.status(201).json({ message: 'Intervention créée ✅', id: Number(result.lastInsertRowid) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT - modifier une intervention
router.put('/:id', async (req, res) => {
    try {
        const { titre, description, statut, id_technicien, id_client, date_planifiee, notes } = req.body;
        const sql = `UPDATE Interventions 
                     SET titre = ?, description = ?, statut = ?, id_technicien = ?, id_client = ?, date_planifiee = ?, notes = ?
                     WHERE id = ?`;
        await db.execute({
            sql,
            args: [titre, description, statut, id_technicien || null, id_client || null, date_planifiee, notes || null, req.params.id]
        });
        res.json({ message: 'Intervention modifiée ✅' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE - supprimer une intervention
router.delete('/:id', async (req, res) => {
    try {
        await db.execute({
            sql: 'DELETE FROM Interventions WHERE id = ?',
            args: [req.params.id]
        });
        res.json({ message: 'Intervention supprimée ✅' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;