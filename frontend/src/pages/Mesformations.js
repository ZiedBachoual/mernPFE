import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';

const Mesformations = () => {
  const { user } = useAuthContext();
  const [formations, setFormations] = useState([]);
  const [error, setError] = useState(null);
console.log(user._id);
  useEffect(() => {
    const fetchFormations = async () => {
      if (user && user._id) {
        console.log('Fetching formations for user:', user);
        try {
          const response = await fetch(`/api/user/${user._id}/formations`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error);
          }

          setFormations(data);
        } catch (err) {
          setError(err.message);
        }
      } else {
        console.error('User ID is missing');
      }
    };

    fetchFormations();
  }, [user]);

  if (!user) {
    return <p>You must be logged in to view your formations.</p>;
  }

  return (
    <div className="my-formations-page">
      <h3>Mes Formations</h3>
      {error && <div className="error">{error}</div>}
      {formations.length > 0 ? (
        <ul>
          {formations.map((formation) => (
            <li key={formation._id}>
              <h4>{formation.title}</h4>
              <p>Catégorie: {formation.categorie}</p>
              <p>Durée: {formation.duree} heures</p>
              <p>Date de début: {new Date(formation.datedebut).toLocaleDateString()}</p>
              <p>Date de fin: {new Date(formation.datefin).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Vous n'êtes inscrit à aucune formation.</p>
      )}
    </div>
  );
};

export default Mesformations;
