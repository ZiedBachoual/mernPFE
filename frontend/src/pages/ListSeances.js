import React, {useEffect, useState} from 'react';
import {useAuthContext} from "../hooks/useAuthContext";
import {useParams} from 'react-router-dom';

const ListSeances = () => {
    const [seances, setSeances] = useState([]);
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [heureDebut, setHeureDebut] = useState('');
    const [duree, setDuree] = useState('');
    const [lieu, setLieu] = useState('');
    const [contenu, setContenu] = useState('');
    const {id} = useParams();
    const {user} = useAuthContext();

    const fetchSeances = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/seance/getallseances', {
                headers: {Authorization: `Bearer ${user.token}`},
            });
            const data = await response.json();
            if (response.ok) {
                setSeances(data);
            } else {
                console.error('Failed to fetch seances:', data.error);
            }
        } catch (error) {
            console.error('Failed to fetch seances:', error);
        }
    };

    const addSeance = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/seance/addseancetoformation', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    formationId: id,
                    title,
                    date,
                    heureDebut,
                    duree,
                    lieu,
                    contenu
                })
            });

            const data = await response.json();
            if (response.ok) {
                alert('Séance ajoutée avec succès!');
                setSeances([...seances, data.seance]);
                setTitle('');
                setDate('');
                setHeureDebut('');
                setDuree('');
                setLieu('');
                setContenu('');
            } else {
                alert(`Échec de l'ajout de la séance: ${data.error}`);
            }
        } catch (error) {
            console.error('Error adding seance:', error);
            alert('Une erreur est survenue lors de l\'ajout de la séance.');
        }
    };

    const deleteSeance = async (seanceId) => {
        try {
            const response = await fetch('http://localhost:3000/api/seance/deleteseance', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ seanceId, formationId: id })
            });

            if (response.ok) {
                alert('Séance supprimée avec succès!');
                setSeances(seances.filter(seance => seance._id !== seanceId));
            } else {
                const error = await response.json();
                alert(`Échec de la suppression de la séance: ${error.message}`);
            }
        } catch (error) {
            console.error('Error deleting seance:', error);
            alert('Une erreur est survenue lors de la suppression de la séance.');
        }
    };

    useEffect(() => {
        fetchSeances();
    }, [id]);

    return (
        <div>
            <h2>Liste des Séances</h2>
            <form onSubmit={addSeance} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                marginBottom: '20px'
            }}>
                <input
                    type="text"
                    placeholder="Titre"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <input
                    type="date"
                    placeholder="Date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Heure de début"
                    value={heureDebut}
                    onChange={(e) => setHeureDebut(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Durée (minutes)"
                    value={duree}
                    onChange={(e) => setDuree(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Lieu"
                    value={lieu}
                    onChange={(e) => setLieu(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Contenu"
                    value={contenu}
                    onChange={(e) => setContenu(e.target.value)}
                />
                <button type="submit" style={{
                    padding: '10px 20px',
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}>Ajouter Séance</button>
            </form>

            {seances.filter(seance => seance.formations.includes(id)).map(seance => (
                <div key={seance._id} style={{
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '20px',
                    marginBottom: '20px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#f0f0f0', // Couleur de fond
                }}>
                    <h3>{seance.title}</h3>
                    <p>Date: {new Date(seance.date).toLocaleDateString()}</p>
                    <p>Heure de début: {seance.heureDebut}</p>
                    <p>Durée: {seance.duree}</p>
                    <p>Lieu: {seance.lieu}</p>
                    <p>Contenu: {seance.contenu}</p>
                    <button style={{
                        padding: '10px 20px',
                        backgroundColor: '#ff4d4d',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }} onClick={() => deleteSeance(seance._id)}>Supprimer
                    </button>
                </div>
            ))}
            {seances.filter(seance => seance.formations.includes(id)).length === 0 && (
                <div style={{
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '20px',
                    marginBottom: '20px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#f0f0f0', // Couleur de fond
                }}>
                    Aucune séance liée à cette formation.
                </div>
            )}
        </div>
    );
};

export default ListSeances;
