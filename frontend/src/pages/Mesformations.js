import React, {useEffect, useState} from 'react';
import {useAuthContext} from "../hooks/useAuthContext";
import FormationDetails from '../components/formationDetails';
import FormationForm from '../components/formationForm';

const Mesformations = () => {
    const [formations, setFormations] = useState([]);
    const {user} = useAuthContext();
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
    }, [user]);

    return (
        <div className="pages">
            <div className="formations">
                {(formations && user?.user?.role == 'user') ? formations
                        .filter(formation => formation.users.includes(user?.user?._id))
                        .map((formation) => (
                            <FormationDetails isRolled={true} key={formation._id} formation={formation}/>
                        )) :
                    formations.filter(formation => formation?.formateurs.includes(user.formateur._id))
                        .map((formation) => (
                            <FormationDetails isRolled={true} key={formation._id} formation={formation}/>
                        ))}
            </div>
        </div>
    );
};

export default Mesformations;
