import React, {useEffect, useState} from 'react';
import {useAuthContext} from "../hooks/useAuthContext";
import FormationDetails from '../components/formationDetails';
import FormationForm from '../components/formationForm';
import {useParams, useNavigate} from 'react-router-dom';

const FormateurFormations = () => {
    const [formations, setFormations] = useState([]);
    const [formateurs, setFormateurs] = useState([]);
    const {user} = useAuthContext();
    const {id} = useParams();
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
    }, [id]);
    return (
        <div className="pages">
            <div className="formations">
                {formations && formations
                    .filter(formation => formation.formateurs.includes(id))
                    .map((formation) => (
                        <FormationDetails formateur={id} key={formation._id} formation={formation} formateurs={formateurs}/>
                    ))}
                {formations && formations
                    .filter(formation => formation.formateurs.includes(id))
                    .length === 0 && (
                    <div style={{
                        width: '100%',
                        textAlign: 'center',
                        padding: '20px',
                        backgroundColor: '#ffffff',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        borderRadius: '10px',
                    }}>
                        Aucune formation liée à ce formateur.
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormateurFormations;
