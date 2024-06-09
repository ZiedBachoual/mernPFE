import React, { useEffect, useState } from 'react';
import { useAuthContext } from "../hooks/useAuthContext";
import FormationDetails from '../components/formationDetails';
import FormationForm from '../components/formationForm';

const Formation = () => {
  const [formations, setFormations] = useState([]);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const response = await fetch(`/api/formation`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setFormations(data);
        } else {
          throw new Error('Failed to fetch formations');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchFormations();
  }, []);

  return (
    <div className="pages">
      <div className="formations">
        {formations && formations.map((formation) => (
          <FormationDetails key={formation._id} formation={formation} />
        ))}
      </div>
      <FormationForm />
    </div>
  );
};


export default Formation;
