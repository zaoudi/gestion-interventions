const API_URL = '/api/interventions';

// Charger les interventions au démarrage de la page
document.addEventListener('DOMContentLoaded', chargerInterventions);

// Fonction pour récupérer et afficher les interventions
function chargerInterventions() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#tableInterventions tbody');
            tbody.innerHTML = '';

            data.forEach(intervention => {
                const nomTech = intervention.tech_nom 
                    ? `${intervention.tech_prenom} ${intervention.tech_nom}` 
                    : '-- Non assigné --';

                const noteActuelle = intervention.notes || '';

                const row = `
                    <tr>
                        <td>${intervention.id}</td>
                        <td>${intervention.titre}</td>
                        <td>${intervention.description || '-'}</td>
                        <td>${nomTech}</td>
                        <td>
                            <select onchange="changerStatut(${intervention.id}, this.value)">
                                <option value="En attente" ${intervention.statut === 'En attente' ? 'selected' : ''}>En attente</option>
                                <option value="En cours" ${intervention.statut === 'En cours' ? 'selected' : ''}>En cours</option>
                                <option value="Terminée" ${intervention.statut === 'Terminée' ? 'selected' : ''}>Terminée</option>
                            </select>
                        </td>
                        <td>${intervention.date_planifiee || '-'}</td>
                        <td>
                            <input type="text" id="note_${intervention.id}" value="${noteActuelle}" placeholder="Ajouter une note...">
                            <button onclick="sauvegarderNote(${intervention.id})">💾</button>
                        </td>
                        <td>
                            <button onclick="supprimerIntervention(${intervention.id})">🗑️ Supprimer</button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        })
        .catch(err => console.error('Erreur:', err));
}
// Nouvelle fonction : changer juste le statut (via le menu déroulant)
function changerStatut(id, nouveauStatut) {
    // On récupère d'abord les données actuelles de l'intervention pour ne pas les perdre
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            const intervention = data.find(i => i.id === id);
            intervention.statut = nouveauStatut;

            fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(intervention)
            })
            .then(res => res.json())
            .then(data => {
                console.log('Statut modifié:', data);
                chargerInterventions();
            })
            .catch(err => console.error('Erreur:', err));
        });
}

function sauvegarderNote(id) {
    const nouvelleNote = document.getElementById(`note_${id}`).value;

    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            const intervention = data.find(i => i.id === id);
            intervention.notes = nouvelleNote;

            fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(intervention)
            })
            .then(res => res.json())
            .then(data => {
                console.log('Note sauvegardée:', data);
                alert('✅ Note enregistrée !');
            })
            .catch(err => console.error('Erreur:', err));
        });
}

// Nouvelle fonction : supprimer une intervention
function supprimerIntervention(id) {
    if (!confirm('Supprimer cette intervention ?')) return;

    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            chargerInterventions();
        })
        .catch(err => console.error('Erreur:', err));
}

// Fonction pour ajouter une nouvelle intervention
function ajouterIntervention() {
    const titre = document.getElementById('titre').value;
    const description = document.getElementById('description').value;
    const date_planifiee = document.getElementById('date_planifiee').value;
    const id_technicien = document.getElementById('intervention_technicien').value || null;

    if (!titre) {
        alert('Le titre est obligatoire !');
        return;
    }

    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            titre,
            description,
            id_technicien,
            id_client: null,
            date_planifiee
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('titre').value = '';
        document.getElementById('description').value = '';
        document.getElementById('date_planifiee').value = '';
        document.getElementById('intervention_technicien').value = '';
        chargerInterventions();
    })
    .catch(err => console.error('Erreur:', err));
}
// ==================== TECHNICIENS ====================

const API_TECHNICIENS_URL = '/api/techniciens';

// Charger les techniciens au démarrage
document.addEventListener('DOMContentLoaded', chargerTechniciens);

function chargerTechniciens() {
    fetch(API_TECHNICIENS_URL)
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#tableTechniciens tbody');
            tbody.innerHTML = '';

            data.forEach(tech => {
                const row = `
                    <tr>
                        <td>${tech.id}</td>
                        <td>${tech.nom}</td>
                        <td>${tech.prenom}</td>
                        <td>${tech.competence || '-'}</td>
                        <td>${tech.disponible ? '✅ Oui' : '❌ Non'}</td>
                        <td>
                            <button onclick="supprimerTechnicien(${tech.id})">🗑️ Supprimer</button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        })
        .catch(err => console.error('Erreur:', err));
}

function ajouterTechnicien() {
    const nom = document.getElementById('tech_nom').value;
    const prenom = document.getElementById('tech_prenom').value;
    const competence = document.getElementById('tech_competence').value;
    const disponible = document.getElementById('tech_disponible').checked ? 1 : 0;

    if (!nom || !prenom) {
        alert('Le nom et le prénom sont obligatoires !');
        return;
    }

    fetch(API_TECHNICIENS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, prenom, competence, disponible })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Ajouté:', data);
        document.getElementById('tech_nom').value = '';
        document.getElementById('tech_prenom').value = '';
        document.getElementById('tech_competence').value = '';
        document.getElementById('tech_disponible').checked = true;
        chargerTechniciens();
    })
    .catch(err => console.error('Erreur:', err));
}

function supprimerTechnicien(id) {
    if (!confirm('Supprimer ce technicien ?')) return;

    fetch(`${API_TECHNICIENS_URL}/${id}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            chargerTechniciens();
        })
        .catch(err => console.error('Erreur:', err));
}
// ==================== SESSION UTILISATEUR ====================

// Affiche le nom de l'utilisateur connecté
document.addEventListener('DOMContentLoaded', () => {
    const utilisateur = JSON.parse(sessionStorage.getItem('utilisateur'));
    if (utilisateur) {
        document.getElementById('nomUtilisateurConnecte').textContent = utilisateur.nom_utilisateur;
    }
});

// Déconnexion
function seDeconnecter() {
    sessionStorage.removeItem('utilisateur');
    window.location.href = 'login.html';
}
// ==================== CLIENTS ====================

const API_CLIENTS_URL = '/api/clients';

document.addEventListener('DOMContentLoaded', chargerClients);

function chargerClients() {
    fetch(API_CLIENTS_URL)
        .then(res => res.json())
        .then(data => {
            const tbody = document.querySelector('#tableClients tbody');
            tbody.innerHTML = '';
            data.forEach(c => {
                tbody.innerHTML += `
                    <tr>
                        <td>${c.id}</td>
                        <td>${c.nom}</td>
                        <td>${c.telephone || '-'}</td>
                        <td>${c.adresse || '-'}</td>
                        <td><button onclick="supprimerClient(${c.id})">🗑️ Supprimer</button></td>
                    </tr>`;
            });
        })
        .catch(err => console.error('Erreur:', err));
}

function ajouterClient() {
    const nom = document.getElementById('client_nom').value;
    const telephone = document.getElementById('client_telephone').value;
    const adresse = document.getElementById('client_adresse').value;

    if (!nom) { alert('Le nom du client est obligatoire !'); return; }

    fetch(API_CLIENTS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, telephone, adresse })
    })
    .then(res => res.json())
    .then(() => {
        document.getElementById('client_nom').value = '';
        document.getElementById('client_telephone').value = '';
        document.getElementById('client_adresse').value = '';
        chargerClients();
    })
    .catch(err => console.error('Erreur:', err));
}

function supprimerClient(id) {
    if (!confirm('Supprimer ce client ?')) return;
    fetch(`${API_CLIENTS_URL}/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(() => chargerClients())
        .catch(err => console.error('Erreur:', err));
}

// ==================== PIECES ====================

const API_PIECES_URL = '/api/pieces';

document.addEventListener('DOMContentLoaded', chargerPieces);

function chargerPieces() {
    fetch(API_PIECES_URL)
        .then(res => res.json())
        .then(data => {
            const tbody = document.querySelector('#tablePieces tbody');
            tbody.innerHTML = '';
            data.forEach(p => {
                tbody.innerHTML += `
                    <tr>
                        <td>${p.id}</td>
                        <td>${p.nom}</td>
                        <td>${p.quantite_stock}</td>
                        <td><button onclick="supprimerPiece(${p.id})">🗑️ Supprimer</button></td>
                    </tr>`;
            });
        })
        .catch(err => console.error('Erreur:', err));
}

function ajouterPiece() {
    const nom = document.getElementById('piece_nom').value;
    const quantite_stock = parseInt(document.getElementById('piece_stock').value) || 0;

    if (!nom) { alert('Le nom de la pièce est obligatoire !'); return; }

    fetch(API_PIECES_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, quantite_stock })
    })
    .then(res => res.json())
    .then(() => {
        document.getElementById('piece_nom').value = '';
        document.getElementById('piece_stock').value = '';
        chargerPieces();
    })
    .catch(err => console.error('Erreur:', err));
}

function supprimerPiece(id) {
    if (!confirm('Supprimer cette pièce ?')) return;
    fetch(`${API_PIECES_URL}/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(() => chargerPieces())
        .catch(err => console.error('Erreur:', err));
}
// ==================== REMPLIR LE MENU DEROULANT TECHNICIEN ====================

function remplirSelectTechniciens() {
    fetch(API_TECHNICIENS_URL)
        .then(res => res.json())
        .then(data => {
            const select = document.getElementById('intervention_technicien');
            select.innerHTML = '<option value="">-- Aucun technicien assigné --</option>';
            data.forEach(tech => {
                select.innerHTML += `<option value="${tech.id}">${tech.prenom} ${tech.nom}</option>`;
            });
        })
        .catch(err => console.error('Erreur:', err));
}

document.addEventListener('DOMContentLoaded', remplirSelectTechniciens);