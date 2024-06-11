import React, { useEffect, useState } from 'react';
import { useAuthContext } from "../hooks/useAuthContext";
import FormationDetails from '../components/formationDetails';
import FormationForm from '../components/formationForm';

const Formation = () => {
  const [formations, setFormations] = useState([]);
  const [formateurs, setFormateurs] = useState([]);
  const { user } = useAuthContext();
  const fetchFormateurs = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/formateur", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await response.json();

      if (response.ok) {
        setFormateurs(json);
      } else {
        console.error("Failed to fetch formateurs:", json.error);
      }
    } catch (error) {
      console.error("Error fetching formateurs:", error);
    }
  };
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
  useEffect(() => {
    fetchFormations();
    fetchFormateurs()
  }, [user]);
  useEffect(() => {
    console.log("formateurs",formateurs)
  }, [formateurs]);
  return (
      <div className="pages">
        <div className="formations">
          {formations && formations
              .filter(formation => !formation.users.includes(user?.user?._id))
              .map((formation) => (
                  <FormationDetails  key={formation._id} formation={formation} formateurs={formateurs} />
              ))}
        </div>
        {user.role == 'admin' && (<FormationForm/>)}
      </div>
  );
};

export default Formation;
